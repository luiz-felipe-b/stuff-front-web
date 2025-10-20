"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import toast from "react-hot-toast";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { Check, X, Minus, Eye, EyeOff } from "lucide-react";
import InputButton from "@/components/Input/InputButton";
import Loader from "@/components/Loader/Loader";
import { userApi } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
// import "../../styles/register.css";
// import { FaEnvelope, FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
// import { RegisterService } from "../../services/register_service";
// import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		userName: "",
		password: "",
		passwordConfirm: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
		const router = useRouter();
		const searchParams = useSearchParams();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const checkPasswordRules = (password: string) => {
		return {
			hasUppercase: /[A-Z]/.test(password),
			hasLowercase: /[a-z]/.test(password),
			hasNumber: /\d/.test(password),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			hasValidLength: password.length >= 12 && password.length <= 16,
		};
	};
	const passwordRules = checkPasswordRules(formData.password);

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			setError("");
			setSuccess(false);
			if (formData.password !== formData.passwordConfirm) {
				setError("As senhas não coincidem");
				return;
			}
			const allRulesValid = Object.values(passwordRules).every(rule => rule);
			if (!allRulesValid) {
				setError("A senha não atende a todos os requisitos");
				return;
			}
			try {
				setLoading(true);
						await userApi.postUsers({
							firstName: formData.firstName.trim(),
							lastName: formData.lastName.trim(),
							userName: formData.userName.trim(),
							email: formData.email.trim().toLowerCase(),
							password: formData.password,
						});
						setSuccess(true);

						// Redirecionamento especial para aceite de convite
						const redirect = searchParams.get("redirect");
						const acceptEmail = searchParams.get("email");
						const acceptOrg = searchParams.get("organization");
						if (redirect === "accept" && acceptEmail && acceptOrg) {
							router.push(`/login?redirect=accept&email=${encodeURIComponent(acceptEmail)}&organization=${encodeURIComponent(acceptOrg)}`);
						} else {
							setTimeout(() => {
								router.push("/login");
							}, 2000);
						}
			} catch (err: any) {
				let errorMessage = "Erro durante o registro";
				if (err.message && err.message.includes("Credenciais de administrador")) {
					errorMessage = "Erro no servidor. Contate o suporte.";
				} else if (err.response?.data?.message) {
					errorMessage = err.response.data.message;
				} else if (err.message) {
					errorMessage = err.message;
				}
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

	useEffect(() => {
		if (error) toast.error(error);
	}, [error]);
	useEffect(() => {
		if (success) toast.success("Conta criada com sucesso! Redirecionando...");
	}, [success]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center relative">
			<div className="w-full max-w-md md:max-w-lg shadow-none md:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] rounded-3xl border-2 bg-stuff-white border-stuff-light p-8 flex flex-col items-center z-10">
				<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
					<img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16" />
					<h2 className="text-xl font-semibold text-stuff-light text-center mb-1">Então você é novo aqui?</h2>
					<p className="text-stuff-gray-100 text-center mb-2">diga-nos um pouco sobre você</p>

										<Input
											type="email"
											name="email"
											placeholder="email"
											icon={<FaEnvelope className="text-stuff-light text-lg" />}
											value={formData.email}
											onChange={handleChange}
											required
										/>

								<div className="flex gap-2 w-full">
											<Input
												type="text"
												name="firstName"
												placeholder="nome"
												icon={<FaUser className="text-stuff-light text-lg" />}
												value={formData.firstName}
												onChange={handleChange}
												required
												className="w-full"
											/>
											<Input
												type="text"
												name="lastName"
												placeholder="sobrenome"
												icon={<FaUser className="text-stuff-light text-lg" />}
												value={formData.lastName}
												onChange={handleChange}
												required
												className="w-full"
											/>
								</div>

										<Input
											type="text"
											name="userName"
											placeholder="nome de usuário"
											icon={<FaUser className="text-stuff-light text-lg" />}
											value={formData.userName}
											onChange={handleChange}
											required
										/>

								<div className="relative w-full">
											<Input
												type={showPassword ? "text" : "password"}
												name="password"
												placeholder="senha"
												icon={<FaLock className="text-stuff-light text-lg" />}
												value={formData.password}
												onChange={handleChange}
												required
												className="pr-10"
											/>
									<InputButton
										icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										onClick={() => setShowPassword((v) => !v)}
									/>
								</div>

					<ul className="flex flex-col gap-2 text-xs mb-2">
						{[
							{
								key: "hasUppercase",
								label: "pelo menos 1 letra maiúscula",
								satisfied: passwordRules.hasUppercase,
							},
							{
								key: "hasLowercase",
								label: "pelo menos 1 letra minúscula",
								satisfied: passwordRules.hasLowercase,
							},
							{
								key: "hasNumber",
								label: "pelo menos 1 número",
								satisfied: passwordRules.hasNumber,
							},
							{
								key: "hasSpecialChar",
								label: "pelo menos 1 caractere especial",
								satisfied: passwordRules.hasSpecialChar,
							},
							{
								key: "hasValidLength",
								label: "entre 12 e 16 caracteres",
								satisfied: passwordRules.hasValidLength,
							},
						].map(({ key, label, satisfied }) => {
							let icon, bgColor, textColor;
							if (satisfied) {
								icon = <Check size={16} className="text-stuff-white" />;
								bgColor = "bg-success-light";
								textColor = "text-success-base";
							} else if (formData.password) {
								icon = <X size={16} className="text-stuff-white" />;
								bgColor = "bg-danger-light";
								textColor = "text-danger-base";
							} else {
								icon = <Minus size={16} className="text-stuff-white" />;
								bgColor = "bg-stuff-gray-100";
								textColor = "text-stuff-gray-100";
							}
							return (
								<li key={key} className={`flex items-center gap-2 ${textColor}`}>
									<span className={`inline-flex items-center justify-center rounded-full ${bgColor} w-5 h-5`}>
										{icon}
									</span>
									<span>{label}</span>
								</li>
							);
						})}
					</ul>

								<div className="relative w-full">
											<Input
												type={showPasswordConfirm ? "text" : "password"}
												name="passwordConfirm"
												placeholder="confirme sua senha"
												icon={<FaLock className="text-stuff-light text-lg" />}
												value={formData.passwordConfirm}
												onChange={handleChange}
												required
												className="pr-10"
											/>
									<InputButton
										icon={showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
										onClick={() => setShowPasswordConfirm((v) => !v)}
									/>
								</div>

										<Button
											type="submit"
											size="md"
											variant="primary"
											palette="default"
											fullWidth
											loading={loading}
											disabled={loading}
										>
											{loading ? <Loader size={20} /> : "criar minha conta"}
										</Button>

							<p className="text-center text-stuff-gray-400 mt-2">
								já tem uma conta? <a href="/pages/login" className="text-stuff-mid hover:underline">faça seu login</a>
							</p>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
// export default RegisterPage;