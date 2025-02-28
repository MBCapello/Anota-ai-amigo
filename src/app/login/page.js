"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginSchema = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    const result = loginSchema.safeParse(loginData);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", loginData);
      const token = response.data.token;

      if (rememberMe) {
        localStorage.setItem("jwt_token", token);
      } else {
        sessionStorage.setItem("jwt_token", token);
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full bg-slate-800">
      <div className="lg:w-1/2 h-full flex justify-center items-center">
        <img
          src="/login-img.jpg"
          alt="Login Image"
          className="w-full h-full max-h-[497px] object-cover shadow-lg rounded-l-2xl"
        />
      </div>
      <div className="flex flex-col justify-center items-center max-w-sm p-6 shadow-lg bg-white lg:w-1/2 h-full max-h-[500px] rounded-r-2xl">
        <h2 className="text-center text-4xl font-bold cursive-font mb-4">Anota aí, amigo!</h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Faça login para acessar sua nova maneira de anotar suas vendas!
        </p>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <Label htmlFor="email"><h3 className="mb-2">Usuário</h3></Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password"><h3 className="mb-2">Senha</h3></Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="mb-4 flex items-center">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className="mr-2"
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-500">
              Lembrar-me
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-4 text-center w-full">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/esqueci-senha" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
              <span className="mr-1">🔑</span> Esqueci minha senha
            </Link>
          </div>
          <hr className="w-full border-gray-200 m-4"/>
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta?
          </p>
          <Link href="/cadastro">
            <Button variant="outline" className="w-full mt-2">Criar Conta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
