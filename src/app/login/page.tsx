"use client";

import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { authApi, userApi } from "@/services/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      console.log('LOGIN SUBMIT', { email, password });
      // if (
      //   email.trim() === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      //   password.trim() === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      // ) {
      //   setSuccess(true);
      //   setTimeout(() => {
      //     router.push("/pages/admin");
      //   }, 1500);
      //   return;
      // }

      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }


      // 1. Login via Zodios endpoint
      await authApi.postAuthlogin({
        email: email.trim(),
        password: password.trim(),
      });

      // 2. Buscar dados do usuário pelo endpoint Zodios
      const userResponse = await userApi.getUsersIdentifier({ params: { identifier: email.trim() } });
      const userData = userResponse.data;
      const userId = userData.id;
      const username = userData.userName;
      const firstName = userData.firstName;
      const lastName = userData.lastName;

      if (!userId || !username) {
        setError("Não foi possível obter os dados do usuário.");
        setLoading(false);
        return;
      }

      // Salva no contexto global
      setUser({ id: userId, username, firstName, lastName });

      localStorage.setItem("userId", userId);
      setSuccess(true);

      setTimeout(() => {
        router.push(`/select-organization`);
      }, 2000);
    } catch (error: any) {
      console.error("Erro no login:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Credenciais inválidas. Por favor, tente novamente.");
            break;
          case 404:
            setError("Usuário não encontrado.");
            break;
          default:
            setError("Ocorreu um erro durante o login. Tente novamente.");
        }
      } else {
        setError(error.message || "Erro desconhecido durante o login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
      {/* Left: Form Section */}
  <section className="w-full md:max-w-[560px] h-screen md:h-auto flex flex-col px-12 py-12 bg-stuff-white rounded-none md:rounded-2xl shadow-none md:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="h-full"></div>
      <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16 mb-32" />
      <h2 className="text-3xl md:text-3xl font-onest font-extrabold
       text-stuff-light">E aí? É bom te ver de novo!</h2>
      <p className="text-stuff-black text-md mb-8">faça seu login e organize-se agora mesmo</p>
      <LoginForm
        loading={loading}
        error={error}
        success={success}
        email={email}
        password={password}
        showPassword={showPassword}
        onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        onShowPasswordToggle={() => !loading && !success && setShowPassword(!showPassword)}
        onSubmit={handleLogin}
      />
      <div className="h-full"></div>
    </div>
  </section>
  {/* Removido div extra para centralização */}
    </main>
  );
};

export default LoginPage;