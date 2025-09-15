"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Alert from "../Alert/Alert";

export interface LoginFormProps {
  loading: boolean;
  error: string;
  success: boolean;
  email: string;
  password: string;
  showPassword: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  error,
  success,
  email,
  password,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onShowPasswordToggle,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Login bem-sucedido! Redirecionando...</Alert>}
      <Input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={onEmailChange}
        required
        disabled={loading || success}
        icon={<FaEnvelope />}
      />
      <div className="relative flex items-center">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={onPasswordChange}
          required
          disabled={loading || success}
          className="pl-4 pr-12"
        />
        <button
          type="button"
          className="absolute right-4 text-stuff-mid text-lg focus:outline-none"
          onClick={onShowPasswordToggle}
          tabIndex={-1}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <Button
        type="submit"
        palette="default"
        variant="primary"
        size="md"
        fullWidth
        loading={loading}
        disabled={loading || success}
      >
        {loading ? "Carregando..." : success ? "Sucesso!" : "Entrar"}
      </Button>
      <div className="flex flex-col gap-2 mt-2">
        <a href="/pages/forgot-password" className="text-sm text-stuff-dark hover:underline text-center">Esqueceu sua senha?</a>
        <a href="/pages/register" className="text-sm text-stuff-dark hover:underline text-center">Não tem uma conta? Crie uma agora!</a>
      </div>
    </form>
  );
};

export default LoginForm;
