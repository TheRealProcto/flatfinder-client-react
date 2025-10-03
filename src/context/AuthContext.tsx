import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { criarPerfilUtilizador } from '../services/usersService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * Regista um utilizador e cria o perfil no Firestore.
   * birthDate no formato YYYY-MM-DD (input type="date").
   */
  registerWithProfile: (p: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string; // YYYY-MM-DD
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(() => {});

  const logout = () => signOut(auth);

  const registerWithProfile: AuthContextType['registerWithProfile'] = async ({
    email,
    password,
    firstName,
    lastName,
    birthDate,
  }) => {
    // 1) Criar conta no Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // 2) (Opcional mas útil) Atualizar displayName no Auth para “First Last”
    try {
      await updateProfile(cred.user, { displayName: `${firstName} ${lastName}`.trim() });
    } catch {
      // silencioso — não é crítico
    }

    // 3) Gravar perfil no Firestore
    await criarPerfilUtilizador({
      uid: cred.user.uid,
      email,
      firstName,
      lastName,
      birthDate, // YYYY-MM-DD
    });

    // Nota: o onAuthStateChanged vai atualizar `user` automaticamente.
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, registerWithProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
