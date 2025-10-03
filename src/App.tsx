// src/App.tsx
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

type Mode = 'login' | 'register';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      setEmail('');
      setPass('');
    } catch (err: any) {
      setError(err?.message ?? 'Erro inesperado.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await signOut(auth);
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
        <h1>FlatFinder — Ligado</h1>
        <p>Olá, <b>{user.email}</b></p>
        <button onClick={handleLogout} disabled={busy}>
          {busy ? 'A sair…' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif', maxWidth: 420 }}>
      <h1>FlatFinder — {mode === 'login' ? 'Login' : 'Registo'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Password<br />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>
        </div>
        {error && (
          <p style={{ color: 'crimson', marginBottom: 8 }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={busy}>
          {busy ? 'A enviar…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        {mode === 'login' ? (
          <button type="button" onClick={() => setMode('register')}>
            Não tens conta? Registar
          </button>
        ) : (
          <button type="button" onClick={() => setMode('login')}>
            Já tenho conta → Login
          </button>
        )}
      </div>
    </div>
  );
}
