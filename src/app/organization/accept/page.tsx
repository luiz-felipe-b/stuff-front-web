"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userApi, organizationsApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import Button from "@/components/Button/Button";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { Check } from "lucide-react";

const AcceptOrganizationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim().toLowerCase() || "";
  const organizationId = searchParams.get("org")?.trim() || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const { user } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      if (!email || !organizationId) {
        toast.error("Parâmetros de convite inválidos. Tente novamente ou solicite um novo convite.");
        router.replace(`/login`);
        return;
      }
      try {
        // Busca dados do usuário
        const userResp = await userApi.getUsersIdentifier({ params: { identifier: email } });
        setUserData(userResp.data);
        // Busca dados da organização
        const orgResp = await organizationsApi.getOrganizationsIdentifier({ params: { identifier: organizationId } });
        setOrgData(orgResp.data);
        // Verifica login
        const userId = localStorage.getItem("userId");
        if (!userId) {
          localStorage.setItem("accept_redirect_email", email);
          localStorage.setItem("accept_redirect_organization", organizationId);
          router.replace(`/login?redirect=accept&email=${encodeURIComponent(email)}&org=${encodeURIComponent(organizationId)}`);
          return;
        }
        setLoading(false);
      } catch (err: any) {
        // Erro robusto: verifica se foi usuário ou organização não encontrada
        let errorMsg = "Erro ao validar convite.";
        if (err?.response?.status === 404) {
          if (err?.response?.data?.message?.toLowerCase().includes("usuário")) {
            errorMsg = "Usuário não encontrado. Faça seu cadastro para continuar.";
          } else if (err?.response?.data?.message?.toLowerCase().includes("organização")) {
            errorMsg = "Organização não encontrada. Verifique o link do convite.";
          } else {
            errorMsg = err?.response?.data?.message || errorMsg;
          }
        } else if (err?.response?.status === 400) {
          errorMsg = err?.response?.data?.message || "Parâmetros inválidos.";
        } else if (err?.message?.toLowerCase().includes("network")) {
          errorMsg = "Erro de rede. Verifique sua conexão.";
        } else if (err?.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
        toast.error(errorMsg);
        localStorage.setItem("accept_redirect_email", email);
        localStorage.setItem("accept_redirect_organization", organizationId);
        router.replace(`/register?redirect=accept&email=${encodeURIComponent(email)}&org=${encodeURIComponent(organizationId)}`);
      }
    };
    checkUser();
    // eslint-disable-next-line
  }, [email, organizationId]);

  // Lógica para, após login/registro, redirecionar de volta para aceite
  useEffect(() => {
    const acceptEmail = localStorage.getItem("accept_redirect_email");
    const acceptOrg = localStorage.getItem("accept_redirect_organization");
    if (acceptEmail && email && acceptEmail === email) {
      localStorage.removeItem("accept_redirect_email");
    }
    if (acceptOrg && organizationId && acceptOrg === organizationId) {
      localStorage.removeItem("accept_redirect_organization");
    }
  }, [email, organizationId]);

  if (loading) {
    return <Loader label="Verificando usuário..." />;
  }

  // Handler para aceitar convite
  const handleAccept = async () => {
    setAcceptLoading(true);
    setError("");
    try {
      if (!user) {
        toast.error("Usuário não autenticado.");
        setAcceptLoading(false);
        return;
      }
      await organizationsApi.postOrganizationsIdmembers({
        userId: user.id,
        role: "user"
      }, {
        params: { id: organizationId }
      });
      setAcceptSuccess(true);
      toast.success("Convite aceito com sucesso! Você já faz parte da organização.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Erro ao aceitar convite";
      setError(msg);
      toast.error(msg);
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
      <section className="w-full max-w-md bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-stuff-light p-8 flex flex-col items-center">
        <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-16 mb-8" />
        <h2 className="text-xl font-regular text-stuff-light mb-2">Você foi convidado a participar de</h2>
        {orgData && (
          <div className="flex flex-col items-center mb-4">
            <span className="text-xl font-extrabold text-stuff-light">{orgData.name}</span>
          </div>
        )}
        <div className="h-12"></div>
        <Button
          palette="success"
          size="md"
          fullWidth
          iconBefore={<Check className="h-5 w-5" />}
          loading={acceptLoading}
          disabled={acceptLoading}
          onClick={handleAccept}
        >
          aceitar convite
        </Button>
      </section>
    </main>
  );
};

export default AcceptOrganizationPage;