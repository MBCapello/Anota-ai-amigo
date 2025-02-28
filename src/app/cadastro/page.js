'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const registerSchema = z
    .object({
      name: z
        .string()
        .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
      email: z.string().email({ message: 'E-mail inválido' }),
      password: z
        .string()
        .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
      confirmPassword: z.string(),
      acceptTerms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    })
    .refine((data) => data.acceptTerms === true, {
      message: 'Você deve aceitar os termos e condições',
      path: ['acceptTerms'],
    });

  const handleRegister = async (event) => {
    event.preventDefault();

    const registerData = {
      name,
      email,
      password,
      confirmPassword,
      acceptTerms,
    };

    const result = registerSchema.safeParse(registerData);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', registerData);

      if (response.status === 201) {
        const { token, user } = response.data;

        localStorage.setItem('jwt_token', token);

        router.push('/dashboard');
      } else {
        setError(response.data.error || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro ao tentar registrar:', error);

      setError(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full bg-slate-800">
      <div className="lg:w-1/2 h-full flex justify-center items-center">
        <img
          src="/signup-img.jpg"
          alt="Signup Image"
          className="w-full h-full max-h-[497px] object-cover shadow-lg rounded-l-2xl"
        />
      </div>
      <div className="flex flex-col justify-center items-center max-w-sm p-6 shadow-lg bg-white lg:w-1/2 h-full max-h-[500px] rounded-r-2xl">
        <h2 className="text-center text-4xl font-bold cursive-font mb-4">
          Junte-se a nós!
        </h2>
        <p className="text-center text-xs text-gray-500 mb-4">
          Crie sua conta para começar a anotar suas vendas!
        </p>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <form onSubmit={handleRegister} className="w-full">
          <div className="mb-2">
            <Label htmlFor="name">
              <h3 className="mb-2">Nome</h3>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label htmlFor="email">
              <h3 className="mb-2">E-mail</h3>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label htmlFor="password">
              <h3 className="mb-2">Senha</h3>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label htmlFor="confirmPassword">
              <h3 className="mb-2">Confirme a Senha</h3>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-2 flex items-center">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
              className="mr-2"
            />
            <Label htmlFor="acceptTerms" className="text-xs text-gray-500">
              Aceito os Termos e Condições
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Criar Conta
          </Button>
        </form>
        <div className="mt-4 text-center w-full">
          <p className="text-xs text-gray-600">
            Já tem uma conta?
            <Link href="/login" className="text-blue-700 hover:underline">
              {' '}
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
