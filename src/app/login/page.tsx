"use client";

import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      if (!email || !password) {
        setError("por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      const loginRes = await authApi.postAuthlogin({
        email: email.trim(),
        password: password.trim(),
      }, {withCredentials: true});

      const accessToken = loginRes.accessToken;
      localStorage.setItem("token", accessToken);

      const userResponse = await userApi.getUsersme({headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} });
      const userData = userResponse.data;
      const userId = userData.id;
      const username = userData.userName;
      const firstName = userData.firstName;
      const lastName = userData.lastName;

      if (!userId || !username) {
        setError("não foi possível obter os dados do usuário.");
        setLoading(false);
        return;
      }

      setUser({ id: userId, username, firstName, lastName });

      localStorage.setItem("userId", userId);
      setSuccess(true);

      // Redirecionamento especial para aceite de convite
      const redirect = searchParams.get("redirect");
      const acceptEmail = searchParams.get("email");
      const acceptOrg = searchParams.get("org");
      if (redirect === "accept" && acceptEmail && acceptOrg) {
        router.push(`/organization/accept?email=${encodeURIComponent(acceptEmail)}&org=${encodeURIComponent(acceptOrg)}`);
      } else {
        router.push(`/organization`);
      }
    } catch (error: any) {
      console.error("erro no login:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("credenciais inválidas. tente novamente.");
            break;
          case 404:
            setError("usuário não encontrado.");
            break;
          default:
            setError("ocorreu um erro durante o login. tente novamente.");
        }
      } else {
        setError(error.message || "erro desconhecido durante o login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
  <section className="w-full md:max-w-[560px] h-screen md:h-auto flex flex-col px-12 py-12 bg-stuff-white rounded-none md:rounded-2xl shadow-none md:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-stuff-light">
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="h-full"></div>
      <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16 mb-32" />
      <h2 className="text-3xl md:text-3xl font-onest font-extrabold
       text-stuff-light">E aí? É bom te ver de novo!</h2>
      <p className="text-stuff-gray-100 text-md mb-8">faça seu login e organize-se agora mesmo</p>
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