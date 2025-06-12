"use client";

import React, { useState } from "react";
import "../../styles/login.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { authService } from "../../../services/login_service";
import { adminService } from "../../../services/admin_service";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // Verificação de admin, Gambiarra
      if (email.trim() === "admin@example.com" && password.trim() === "admin123") {
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
        password: password.trim()
      });

      // 2. Buscar dados do usuário pelo email
      const userData = await adminService.getUserByIdentifier(email.trim());
      const userId = userData.id;

      if (!userId) {
        setError("Não foi possível obter o id do usuário.");
        setLoading(false);
        return;
      }
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
    <div className="login-page">
      <div className="login-form-container">
        <h1 className="login-title">Stuff.</h1>

        <h2 className="login-subtitle">E aí? É bom te ver de novo!</h2>
        <p className="login-description">
          Faça seu login e organize-se agora mesmo
        </p>

        {error && <div className="error-message">{error}</div>}
        
        {success && (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            Login bem-sucedido! Redirecionando...
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
            />
          </div>

          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || success}
            />
            <div
              className="input-icon"
              onClick={() => !loading && !success && setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || success}
          >
            {loading ? "Carregando..." : success ? "Sucesso!" : "Entrar"}
          </button>
          
          <a href="/pages/forgot-password" className="forgot-password">
            Esqueceu sua senha?
          </a>
          <a href="/pages/register" className="create-account">
            Não tem uma conta? Crie uma agora!
          </a>
        </form>
      </div>
      <div className="login-image-container">
        <img src="/img_login.png" alt="Login" />
      </div>
    </div>
  );
};

export default LoginPage;