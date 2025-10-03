import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [modo, setModo] = useState<'login' | 'registo'>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErro(null);
    try {
      if (modo === 'login') {
        await login(email, pass);
      } else {
        await register(email, pass);
      }
      const from = location.state?.from?.pathname ?? '/';
      navigate(from);
    } catch (err: any) {
      setErro(err?.message ?? 'Ocorreu um erro.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>{modo === 'login' ? 'Entrar' : 'Criar conta'}</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email<br />
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Palavra-passe<br />
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required minLength={6} />
          </label>
        </div>
        {erro && <p style={{ color: 'crimson' }}>{erro}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'A enviar…' : (modo === 'login' ? 'Entrar' : 'Criar conta')}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        {modo === 'login' ? (
          <button onClick={() => setModo('registo')}>Não tens conta? Registar</button>
        ) : (
          <button onClick={() => setModo('login')}>Já tenho conta → Entrar</button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/">Voltar à página inicial</Link>
      </div>
    </div>
  );
}
