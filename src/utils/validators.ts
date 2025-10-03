import { z } from 'zod';

// util simples: calcula idade a partir de Date
function calcularIdade(dataNasc: Date) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) idade--;
  return idade;
}

// Password: ≥6, com letras, números e 1 não alfanumérico
export const passwordSchema = z
  .string()
  .min(6, 'A palavra-passe deve ter pelo menos 6 caracteres')
  .refine((v) => /[A-Za-z]/.test(v), 'Deve conter letras')
  .refine((v) => /\d/.test(v), 'Deve conter números')
  .refine((v) => /[^A-Za-z0-9]/.test(v), 'Deve conter 1 caractere não alfanumérico');

// Registo completo (para o formulário)
export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Primeiro nome com pelo menos 2 letras'),
    lastName: z.string().min(2, 'Último nome com pelo menos 2 letras'),
    // input tipo date -> string "YYYY-MM-DD"
    birthDate: z
      .string()
      .refine((v) => {
        // aceitar apenas formato YYYY-MM-DD
        const okFormato = /^\d{4}-\d{2}-\d{2}$/.test(v);
        if (!okFormato) return false;
        const d = new Date(v + 'T00:00:00');
        if (Number.isNaN(d.getTime())) return false;
        const idade = calcularIdade(d);
        return idade >= 18 && idade <= 120;
      }, 'Idade deve estar entre 18 e 120 anos'),
    email: z.string().email('Email inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((dados) => dados.password === dados.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  });

// Tipos úteis no resto do código
export type RegisterForm = z.infer<typeof registerSchema>;
