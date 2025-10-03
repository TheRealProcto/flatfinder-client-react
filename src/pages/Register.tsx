// src/pages/Register.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterForm } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { registerWithProfile } = useAuth();
  const navigate = useNavigate();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterForm) {
    setErroServidor(null);
    try {
      await registerWithProfile({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate, // YYYY-MM-DD
      });
      navigate('/');
    } catch (e: any) {
      setErroServidor(e?.message ?? 'Erro ao criar conta.');
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 520 }}>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 8 }}>
          <label>Primeiro nome<br />
            <input {...register('firstName')} />
          </label>
          {errors.firstName && <p style={{ color: 'crimson' }}>{errors.firstName.message}</p>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Apelido<br />
            <input {...register('lastName')} />
          </label>
          {errors.lastName && <p style={{ color: 'crimson' }}>{errors.lastName.message}</p>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Data de nascimento<br />
            <input type="date" {...register('birthDate')} />
          </label>
          {errors.birthDate && <p style={{ color: 'crimson' }}>{errors.birthDate.message}</p>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email<br />
            <input type="email" autoComplete="email" {...register('email')} />
          </label>
          {errors.email && <p style={{ color: 'crimson' }}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Palavra-passe<br />
            <input type="password" autoComplete="new-password" {...register('password')} />
          </label>
          {errors.password && <p style={{ color: 'crimson' }}>{errors.password.message}</p>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Confirmar palavra-passe<br />
            <input type="password" autoComplete="new-password" {...register('confirmPassword')} />
          </label>
          {errors.confirmPassword && <p style={{ color: 'crimson' }}>{errors.confirmPassword.message}</p>}
        </div>

        {erroServidor && <p style={{ color: 'crimson' }}>{erroServidor}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'A criar…' : 'Criar conta'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        Já tens conta? <Link to="/login">Entrar</Link>
      </div>
    </div>
  );
}
