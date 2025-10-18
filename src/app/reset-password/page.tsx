
"use client";

import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { Check, X, Minus } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import InputButton from "@/components/Input/InputButton";
import { authApi } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";

function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: "",
        passwordConfirm: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isTokenValid, setIsTokenValid] = useState<boolean>(!!(token && token.trim() !== ""));

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        const isValid = !!(tokenFromUrl && tokenFromUrl.trim() !== "");
        setIsTokenValid(isValid);
        if (!isValid) {
            setError("Insira o token enviado no E-mail na URL!");
        } else {
            setError("");
        }
    }, [searchParams]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            toast.success(success + " Redirecionando...");
        }
    }, [success]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        setSuccess(undefined);
        if (formData.password !== formData.passwordConfirm) {
            setError("as senhas não coincidem");
            return;
        }
        const allRulesValid = Object.values(passwordRules).every((rule) => rule);
        if (!allRulesValid) {
            setError("a senha não atende a todos os requisitos");
            return;
        }
        setLoading(true);
        try {
            await authApi.postAuthresetPassword({ token: token as string, newPassword: formData.password });
            setSuccess("senha trocada com sucesso!");
            router.push("/login");
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError("a senha enviada é inválida!");
                        break;
                    case 401:
                        setError("usuário não autenticado!");
                        break;
                    case 403:
                        setError("o token enviado não é valido!");
                        break;
                    case 404:
                        setError("não foi possível encontrar o usuário para a alteração");
                        break;
                    default:
                        setError("ocorreu um erro durante a troca de senha. Tente novamente.");
                }
                return;
            }
            setError(error.message || "erro desconhecido durante o login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="w-full md:max-w-[560px] h-screen md:h-auto flex flex-col bg-stuff-white border-2 border-stuff-light max-w-md bg-white/95 rounded-3xl shadow-none md:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 items-center">
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16" />
                    <h2 className="text-xl font-bold text-stuff-light text-center mb-1">Troca de Senha</h2>
                    <p className="text-stuff-gray-100 text-center mb-2">tudo certo agora! digite sua nova senha.</p>

                    {/* Toast notifications for error/success are now handled via react-hot-toast */}

                    <div className="relative w-full">
                        <Input
                            type={showPassword ? "text" : "password"}
                            disabled={!isTokenValid}
                            name="password"
                            placeholder="nova senha"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            icon={<FaLock className="text-stuff-light text-lg" />}
                            autoComplete="new-password"
                            className="pr-10"
                        />
                        <InputButton
                            icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            onClick={() => setShowPassword((v) => !v)}
                        />
                    </div>
                    <ul className="flex flex-col gap-2 text-sm mb-2">
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
                            disabled={!isTokenValid}
                            type={showPasswordConfirm ? "text" : "password"}
                            name="passwordConfirm"
                            placeholder="confirme sua senha"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                            icon={<FaLock className="text-stuff-light text-lg" />}
                            autoComplete="new-password"
                            className="pr-10"
                        />
                        <InputButton
                            icon={showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            onClick={() => setShowPasswordConfirm((v) => !v)}
                        />
                    </div>

                    <Button
                        type="submit"
                        palette="default"
                        variant="primary"
                        className="mt-2 text-base"
                        loading={loading}
                        disabled={!isTokenValid || loading}
                        fullWidth
                    >
                        {loading ? <Loader color="#FFFFFF" size={20} /> : "trocar senha"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}