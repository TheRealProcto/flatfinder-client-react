import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export async function criarPerfilUtilizador(params: {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
}) {
  const data = new Date(params.birthDate + 'T00:00:00');
  const ref = doc(db, 'users', params.uid);

  await setDoc(ref, {
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    birthDate: Timestamp.fromDate(data),
    isAdmin: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function obterPerfilUtilizador(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;

  const d = snap.data();
  return {
    id: snap.id,
    email: d.email,
    firstName: d.firstName,
    lastName: d.lastName,
    birthDate: (d.birthDate as Timestamp).toDate(),
    isAdmin: !!d.isAdmin,
    createdAt: d.createdAt?.toDate?.(),
    updatedAt: d.updatedAt?.toDate?.(),
  };
}
