"use client";
import { toast } from "react-hot-toast";

import { useState } from "react";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import { authApi } from "@/services/api";
import { useRouter } from "next/navigation";


const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleFPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(undefined);
        try {
            await authApi.postAuthforgotPassword({ email });
            setSuccess("E-mail de troca de senha enviado!");
            toast.success("E-mail de troca de senha enviado!");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setError("Usuário não encontrado.");
                        toast.error("Usuário não encontrado.");
                        break;
                    default:
                        setError("Ocorreu um erro ao enviar o e-mail. Tente novamente.");
                        toast.error("Ocorreu um erro ao enviar o e-mail. Tente novamente.");
                }
                return;
            }
            setError(error.message || "Erro desconhecido ao enviar o e-mail");
            toast.error(error.message || "Erro desconhecido ao enviar o e-mail");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="w-full md:max-w-[560px] h-screen md:h-auto flex flex-col bg-stuff-white border-2 border-stuff-light max-w-md bg-white/95 rounded-3xl shadow-none md:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 items-center">
                <form className="w-full flex flex-col gap-5" onSubmit={handleFPSubmit}>
                    <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16 mb-4" />
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-extrabold text-stuff-light text-center">Recuperar acesso</h2>
                        <p className="text-stuff-gray-100 text-center text-md">digite seu e-mail para receber o link de redefinição de senha.</p>
                    </div>
                    
                    <Input
                        type="email"
                        name="email"
                        placeholder="seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        disabled={loading}
                        icon={<FaEnvelope className="text-stuff-light text-lg" />}
                    />

                    <Button
                        type="submit"
                        palette="default"
                        variant="primary"
                        className="mt-2 text-base"
                        loading={loading}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? <Loader size={20} className="mr-2 text-stuff-white" /> : "enviar link de redefinição"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;