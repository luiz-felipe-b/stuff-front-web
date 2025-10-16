"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { assetsApi, attributesApi, organizationsApi } from "@/services/api";
import { OrganizationsApi } from "@/api/generated/organizations";
// import "../../../styles/organizacao.css";
import Header from "@/components/header/header";
import { Mail, Package, Plus, Shield, ShieldCheck, Trash, UserPlus, Users, X } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import AssetList from "@/components/AssetList/AssetList";
import MemberList, { Member as MemberType } from "@/components/member-list/MemberList";
// Remove legacy services, use generated API clients only
import { useUser } from "@/context/UserContext";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import "./style.css";

interface Organization {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Member type is now imported from MemberList

interface Asset {
    id: string;
    organizationId: string;
    templateId?: string | null;
    creatorUserId: string;
    name: string;
    description?: string;
    trashBin: boolean;
    createdAt: string;
    updatedAt: string;
    type: string;
    quantity?: number | null;
}

type TabType = 'assets' | 'members';

const SpecificOrganizationPage = () => {
    const [org, setOrg] = useState<Organization | null>(null);
    const { organization } = useSelectedOrganization();
    const router = useRouter();
    const { user, setUser } = useUser();
    const [members, setMembers] = useState<Member[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("membro");
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>('assets');
    const params = useParams();

    const organizationId = params.id as string;
    
        // Require selected organization
        useEffect(() => {
            if (!organization) {
                router.replace('/select-organization');
            }
        }, [organization, router]);

        // Buscar todas as organizações ao carregar a página
        useEffect(() => {
            if (organizationId) {
                fetchSpecificOrganization(organizationId);
                fetchOrganizationAssets(organizationId);
            }
        }, [organizationId]);

    if (!user || !organization) return null;
    

    async function fetchSpecificOrganization(id: string) {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            const orgResponse = await organizationsApi.getOrganizationsIdentifier({ params: {identifier: id}, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const organization = orgResponse.data;
            console.log("Fetched organization:", organization);
            if (organization) {
                setOrg(organization);
                await fetchMembers(organization);
            }
        } catch (err) {
            setErrorMsg("Erro ao buscar organização. Verifique se o ID está correto.");
        }
        setLoading(false);
    }

    async function fetchOrganizationAssets(orgId: string) {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            const assetsResp = await organizationsApi.getOrganizationsIdassets({ params: {id: orgId}, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const assetList = assetsResp.data || [];
            // Fetch each asset's full details (with attributes)
            const assetsWithAttributes = await Promise.all(
                assetList.map(async (a: any) => {
                    try {
                        const assetDetailResp = await assetsApi.getAssetsId({ params: { id: a.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
                        const asset = assetDetailResp.data;
                        return {
                            ...asset,
                            templateId: asset.templateId ?? null,
                            description: asset.description ?? "",
                            organizationId: asset.organizationId ?? "",
                        };
                    } catch (err) {
                        // If fetching details fails, fallback to basic asset info
                        return {
                            ...a,
                            templateId: a.templateId ?? null,
                            description: a.description ?? "",
                            organizationId: a.organizationId ?? "",
                        };
                    }
                })
            );
            setAssets(assetsWithAttributes);
        } catch (err) {
            setErrorMsg("Erro ao buscar ativos da organização.");
        }
        setLoading(false);
    }

    async function fetchMembers(org: Organization) {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            const data = await organizationsApi.getOrganizationsIdmembers({ params: {id: org.id}, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            // Map to match Member type exactly (id, email, role)
            setMembers((data.data || []).map((m: any) => ({
                id: m.id,
                email: m.email,
                role: m.role,
            })));
        } catch (err) {
            setErrorMsg("Erro ao buscar membros da organização.");
        }
        setLoading(false);
    }

    const handleSelectOrg = (org: Organization) => {
        setOrg(org);

        fetchMembers(org);
        setSuccessMsg("");
        setErrorMsg("");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        // setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            if (org) {
                setErrorMsg("Atualização de organização não implementada.");
            } else {
                // await organizationService.createOrganization(form);
                // await fetchAllOrganizations();
                // setForm({ name: "", description: "", password: "", slug: "" });
                setSuccessMsg("Organização criada com sucesso!");
                setShowCreateModal(false); // Fechar modal após criar
            }
            setOrg(null);
        } catch (err) {
            setErrorMsg(
                "Erro ao salvar organização. Verifique os dados e tente novamente."
            );
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        // setForm({ name: "", description: "", password: "", slug: "" });
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleDelete = async () => {
        if (org) {
            setLoading(true);
            setErrorMsg("");
            setSuccessMsg("");
            try {
                const token = localStorage.getItem("token");
                // deleteOrganizationsId expects only options as argument
                await onbeforeinputrganizationsApi.deleteOrganizationsId({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
                setOrg(null);
                setMembers([]);
                setSuccessMsg("Organização deletada com sucesso!");
            } catch (err) {
                setErrorMsg("Erro ao deletar organização. Tente novamente.");
            }
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!org) return;
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            if (!email) {
                setErrorMsg("Informe o e-mail do usuário para adicionar.");
                setLoading(false);
                return;
            }
            // Buscar userId pelo email não suportado pelo generated API, show error
            setErrorMsg("Busca de usuário por e-mail não suportada pela API gerada.");
            setLoading(false);
            return;
        } catch (err) {
            setErrorMsg(
                "Erro ao adicionar membro. Verifique o e-mail e tente novamente."
            );
        }
        setLoading(false);
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        if (!org) return;
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            // patchOrganizationsIdmembersUserId expects (id, userId, body, options)
            await organizationsApi.patchOrganizationsIdmembersUserId(org.id, userId, { role: newRole as any }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            await fetchMembers(org);
            setSuccessMsg("Função do membro atualizada com sucesso!");
        } catch (err) {
            setErrorMsg("Erro ao atualizar a função do membro.");
        }
        setLoading(false);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!org) return;
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            // deleteOrganizationsIdmembersUserId expects (id, userId, options)
            await organizationsApi.deleteOrganizationsIdmembersUserId(undefined, { params: { id: org.id, userId }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            await fetchMembers(org);
            setSuccessMsg("Membro removido com sucesso!");
        } catch (err) {
            setErrorMsg("Erro ao remover membro da organização.");
        }
        setLoading(false);
    };

    const handleEditAsset = async (assetId: string) => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
    }

        // Add attribute: if attribute is string (attributeId), only post value. If object, create then post value.
        // Only refresh assets after attribute is added in modal
        const handleAddAttribute = async () => {
            await fetchOrganizationAssets(organizationId);
        };

    const handleAddAsset = async (asset: {
      organizationId?: string | null | undefined;
      templateId?: string | null | undefined;
      name: string;
      description: string;
    }) => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            const token = localStorage.getItem("token");
            const resp = await assetsApi.postAssets({
                type: "unique",
                organizationId: org?.id || "",
                name: asset.name,
                description: asset.description ?? "",
                templateId: asset.templateId ?? null,
            }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            // Accept both array and object responses
            let newAssets: any[] = [];
            if (Array.isArray(resp.data)) {
                newAssets = resp.data;
            } else if (resp.data && typeof resp.data === 'object') {
                newAssets = [resp.data];
            }
            setAssets((prev) => [
                ...prev,
                ...newAssets.map((a: any) => ({
                    ...a,
                    templateId: a.templateId ?? null,
                    description: a.description ?? "",
                    organizationId: a.organizationId ?? "",
                }))
            ]);
            setSuccessMsg("Ativo adicionado com sucesso!");
        } catch (err) {
            console.error("Erro ao adicionar ativo:", err);
            setErrorMsg("Erro ao adicionar ativo.");
        }
        setLoading(false);
    }

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? <ShieldCheck size={16} /> : <Shield size={16} />;
    };

    const getRoleBadgeClass = (role: string) => {
        return role === 'admin' ? 'role-badge admin' : 'role-badge member';
    };

    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-start px-4 bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
                <Header activeTab="organization" />
                <section className="w-full flex-1 flex flex-col bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] items-center py-10 px-6 md:px-16 my-4">
                    <Breadcrumb items={[
                        { label: "Organizações", href: "/organization" },
                        { label: org?.name ? org.name : "Organização" }]} />
                    {/* {successMsg && <div className="success-message mb-4">{successMsg}</div>}
                    {errorMsg && <div className="error-message mb-4">{errorMsg}</div>} */}
                    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 my-6">
                        <div>
                            <h1 className="text-3xl font-bold text-stuff-mid mb-1">{org?.name}</h1>
                            <p className="text-stuff-dark text-lg">{org?.description}</p>
                        </div>
                        {/* Optionally add org actions here */}
                    </div>
                    <div className="flex flex-row gap-2 mb-6 w-full">
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold text-base transition-colors ${activeTab === 'assets' ? 'bg-stuff-primary text-white' : 'bg-stuff-gray-50 text-stuff-mid'}`}
                            onClick={() => setActiveTab('assets')}
                        >
                            <Package size={18} className="inline mr-2" />Ativos ({assets.length})
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold text-base transition-colors ${activeTab === 'members' ? 'bg-stuff-primary text-white' : 'bg-stuff-gray-50 text-stuff-mid'}`}
                            onClick={() => setActiveTab('members')}
                        >
                            <Users size={18} className="inline mr-2" />Membros ({members.length})
                        </button>
                    </div>
                    <div className="w-full">
                        {activeTab === 'assets' && (
                            <div className="w-full">
                                <AssetList
                                    assets={assets}
                                    onAddAttribute={handleAddAttribute}
                                    onAddAsset={handleAddAsset}
                                    loading={loading}
                                />
                            </div>
                        )}
                        {activeTab === 'members' && (
                            <div className="w-full">
                                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                                    <div className="flex-1 flex flex-row items-center gap-2">
                                        <Mail size={16} className="text-stuff-mid" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email do usuário"
                                            className="flex-1 border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary"
                                        />
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="border border-stuff-gray-100 rounded-lg px-2 py-2 focus:outline-none"
                                        >
                                            <option value="membro">Membro</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            onClick={handleAddUser}
                                            disabled={loading || !email.trim()}
                                            className="ml-2 px-4 py-2 rounded-lg bg-stuff-primary text-white font-semibold hover:bg-stuff-primary-dark transition-colors"
                                        >
                                            <UserPlus size={16} className="inline mr-1" />
                                            {loading ? 'Adicionando...' : 'Adicionar'}
                                        </button>
                                    </div>
                                </div>
                                <MemberList
                                    members={members}
                                    loading={loading}
                                    onUpdateRole={handleUpdateRole}
                                    onDelete={handleDeleteUser}
                                />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default SpecificOrganizationPage;
