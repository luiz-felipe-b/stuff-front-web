"use client";

import React, { useState } from "react";
import "../../styles/register.css";
import { FaEnvelope, FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  // Função para verificar as regras da senha
  const checkPasswordRules = (password: string) => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasValidLength: password.length >= 12 && password.length <= 16,
    };
  };

  const passwordRules = checkPasswordRules(password);

  return (
    <div className="register-page">
      <img src="/register_img.png" alt="Background" className="background-image" />
      <div className="register-form-container">
        <form className="register-form">
          <h1 className="register-title">stuff.</h1>
          <h2 className="register-subtitle">Então você é novo aqui?</h2>
          <p className="register-description">Diga-nos um pouco sobre você</p>

          {/* Email */}
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email" className="input-field" />
          </div>

          {/* Nome e Sobrenome */}
          <div className="input-row">
            <div className="input-container">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Nome" className="input-field" />
            </div>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Sobrenome" className="input-field" />
            </div>
          </div>

          {/* Nome de usuário */}
          <div className="input-container">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Nome de usuário" className="input-field" />
          </div>

          {/* Senha */}
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye/>}
            </div>
          </div>

          <div className="password-rules">
            <p className={passwordRules.hasUppercase ? "rule valid" : password ? "rule invalid" : "rule"}>
              Pelo menos 1 letra maiúscula
            </p>
            <p className={passwordRules.hasLowercase ? "rule valid" : password ? "rule invalid" : "rule"}>
              Pelo menos 1 letra minúscula
            </p>
            <p className={passwordRules.hasNumber ? "rule valid" : password ? "rule invalid" : "rule"}>
              Pelo menos 1 número
            </p>
            <p className={passwordRules.hasSpecialChar ? "rule valid" : password ? "rule invalid" : "rule"}>
              Pelo menos 1 caractere especial
            </p>
            <p className={passwordRules.hasValidLength ? "rule valid" : password ? "rule invalid" : "rule"}>
              Entre 12 e 16 caracteres
            </p>
          </div>

        {/* Confirmação de senha */}
        <div className="input-container">
            <FaLock className="input-icon-left" />
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                className="input-field"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          <div
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

          {/* Botão de criar conta */}
          <button type="submit" className="register-button">
            Criar minha conta
          </button>

          {/* Redirecionamento para login */}
          <p className="login-redirect">
            Já tem uma conta? <a href="/auth/login">Faça seu login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;