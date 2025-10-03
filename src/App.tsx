import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import RequireAuth from './routes/RequireAuth';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
<Routes>
  <Route element={<RequireAuth />}>
    <Route path="/" element={<Home />} />
  </Route>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />   {/* <-- novo */}
</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
