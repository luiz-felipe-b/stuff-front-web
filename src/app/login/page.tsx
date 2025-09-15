"use client";

import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { authService } from "../../services/login_service";
import { adminService } from "../../services/admin_service";
import { useUser } from "../../context/UserContext";

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
      if (
        email.trim() === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password.trim() === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/pages/admin");
        }, 1500);
        return;
      }

      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      // 1. Login
      await authService.loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      // 2. Buscar dados do usuário pelo email
      const userData = await adminService.getUserByIdentifier(email.trim());
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
        router.push(`/pages/dashboard`);
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
    <main className="min-h-screen flex flex-col md:flex-row bg-stuff-bg items-center justify-center">
      {/* Left: Form Section */}
      <section className="w-full md:w-[480px] flex flex-col justify-center items-center px-8 py-12 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:mr-8">
        <h1 className="text-[40px] leading-[48px] font-bold text-stuff-dark mb-2 tracking-tight">Stuff.</h1>
        <h2 className="text-lg md:text-xl font-semibold text-stuff-mid mb-2">E aí? É bom te ver de novo!</h2>
        <p className="text-stuff-dark text-base mb-8">Faça seu login e organize-se agora mesmo</p>
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
      </section>
      {/* Right: Image Section */}
      <section className="hidden md:flex flex-1 h-full items-center justify-center p-0 md:p-8">
        <img src="/img_login.png" alt="Login" className="w-[480px] max-w-full h-auto rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] object-cover" />
      </section>
    </main>
  );
};

export default LoginPage;