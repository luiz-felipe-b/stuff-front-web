"use client";

import React, { useState } from "react";
import "../../styles/login.css";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuário:", username, "Senha:", password);
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1 className="login-title">Stuff</h1>

        <h2 className="login-subtitle">E aí? É bom te ver de novo!</h2>
        <p className="login-description">
          Faça seu login e organize-se agora mesmo
        </p>

        <form onSubmit={handleLogin} className="login-form">
          {/* Caixa de texto com ícone de usuário */}
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Nome de usuário ou e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Caixa de texto com ícone de olho interativo */}
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
          <a href="#" className="forgot-password">
            Esqueceu sua senha?
          </a>
          <a href="/auth/register" className="create-account">
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