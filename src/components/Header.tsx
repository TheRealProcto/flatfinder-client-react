import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{ padding: 12, borderBottom: '1px solid #ddd', display: 'flex', gap: 12 }}>
      <Link to="/">FlatFinder</Link>

      <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
        {user ? (
          <>
            <span>Olá, <b>{user.email}</b></span>
            <button onClick={() => void logout()}>Terminar sessão</button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </nav>
    </header>
  );
}
