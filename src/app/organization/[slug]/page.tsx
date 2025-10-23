"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assetsApi, organizationsApi, reportsApi } from "@/services/api";
import Header from "@/components/Header/Header";
import { useUser } from "@/context/UserContext";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { Box, Calendar, Home, User } from "lucide-react";
import AssetRegistrationChart from "@/components/AssetRegistrationChart";
import ReportTimelineChart from "@/components/ReportTimelineChart";
import Loader from "@/components/Loader/Loader";
import { OrganizationsApi } from "@/api/generated";

interface Organization {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}


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
    const router = useRouter();
    const { user } = useUser();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<any[]>([]);

    // Fetch organization, assets and members on mount or slug change
    useEffect(() => {
        // Get slug from URL
        const slug = window.location.pathname.split("/").filter(Boolean).pop();
        if (!slug) {
            router.replace('/organization');
            return;
        }
        fetchOrganization(slug);
    }, [router]);

    async function fetchOrganization(slug: string) {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const orgResp = await organizationsApi.getOrganizationsIdentifier({ params: { identifier: slug }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const org = orgResp.data;
            setOrganization(org);
            // Fetch assets, members and reports with org id
            if (org?.id) {
                await Promise.all([
                    fetchOrganizationAssets(org.id),
                    fetchOrganizationMembers(org.id),
                    fetchOrganizationReports(org.id)
                ]);
            }
        } catch (err) {
            router.replace('/organization');
        }
        setLoading(false);
    }

    async function fetchOrganizationReports(orgId: string) {
        try {
            const token = localStorage.getItem("token");
            const reportsResp = await organizationsApi.getOrganizationsIdreports({ params: { id: orgId }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            setReports(reportsResp.data || []);
        } catch (err) {
            // handle error
        }
    }

    async function fetchOrganizationAssets(orgId: string) {
        try {
            const token = localStorage.getItem("token");
            const assetsResp = await organizationsApi.getOrganizationsIdassets({ params: { id: orgId }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const assetList = assetsResp.data || [];
            // Fetch each asset's full details (with attributes)
            const assetsWithAttributes = await Promise.all(
                assetList.map(async (a: any) => {
                    try {
                        const assetDetailResp = await assetsApi.getAssetsId({ params: { id: a.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
                        const asset = assetDetailResp.data;
                        return {
                            ...asset,
                            description: asset.description ?? "",
                            organizationId: asset.organizationId ?? "",
                        };
                    } catch (err) {
                        // If fetching details fails, fallback to basic asset info
                        return {
                            ...a,
                            description: a.description ?? "",
                            organizationId: a.organizationId ?? "",
                        };
                    }
                })
            );
            setAssets(assetsWithAttributes);
        } catch (err) {
            // handle error
        }
    }

    async function fetchOrganizationMembers(orgId: string) {
        try {
            const token = localStorage.getItem("token");
            const membersResp = await organizationsApi.getOrganizationsIdmembers({ params: { id: orgId }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            setMembers(membersResp.data || []);
        } catch (err) {
            // handle error
        }
    }

    // Processa os dados dos ativos para os últimos 10 dias
    const assetRegistrationsByDay = React.useMemo(() => {
        const days: string[] = [];
        const today = new Date();
        for (let i = 9; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d.toLocaleDateString());
        }
        const counts: Record<string, number> = {};
        days.forEach(date => { counts[date] = 0; });
        assets.forEach(asset => {
            const date = new Date(asset.createdAt).toLocaleDateString();
            if (counts[date] !== undefined) counts[date]++;
        });
        return days.map(date => ({ date, count: counts[date] }));
    }, [assets]);

    // Processa os dados dos relatórios para os últimos 10 dias
    const reportTimelineData = React.useMemo(() => {
        const days: string[] = [];
        const today = new Date();
        for (let i = 9; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d.toLocaleDateString());
        }
        const counts: Record<string, number> = {};
        days.forEach(date => { counts[date] = 0; });
        reports.forEach(report => {
            const date = new Date(report.createdAt).toLocaleDateString();
            if (counts[date] !== undefined) counts[date]++;
        });
        return days.map(date => ({ date, count: counts[date] }));
    }, [reports]);


    if (!user || !organization) return null;

    return (
        <>
            <div className="h-full w-full flex items-center flex-col p-8">
                <Header activeTab="home" organizationName={organization.name} />
                <section className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
                    <div className="flex gap-2 items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Home className="text-stuff-light mr-2 inline-block" />
                            <h1 className="text-2xl font-bold text-stuff-light">Início</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-stuff-light inline-block" />
                            <span className="text-md font-medium text-stuff-light">Criada em {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : "-"}</span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <span className="text-lg font-extrabold text-stuff-light">Bem-vindo, {user?.firstName || user?.username || "usuário"}!</span>
                        <p className="text-stuff-gray-100 text-md">que bom te ver por aqui. aproveite para gerenciar os ativos e membros da organização <span className="font-semibold text-stuff-light">{organization.name}</span>.</p>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-[60vh] w-full">
                            <Loader />
                        </div>
                    ) : (
                        <div className="overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 w-full">
                                {/* Cards Column */}
                                <div className="flex flex-col h-full">
                                    <div className="flex flex-col gap-2 h-full">
                                        <div className='flex flex-col justify-between border-2 border-b-4 border-stuff-light rounded-2xl p-6 md:p-8 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] min-h-[120px] md:min-h-[160px] lg:min-h-[180px] h-full w-full'>
                                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-stuff-light mb-2 md:mb-4">ativos registrados</h3>
                                            <div className="flex h-full items-center justify-start">
                                                <Box className="text-stuff-light mr-2 md:mr-4" size={32} />
                                                <span className="text-3xl md:text-5xl lg:text-6xl text-stuff-black font-extrabold">{assets.length}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2 w-full">
                                            <div className='flex flex-col justify-between border-2 border-b-4 border-success-light rounded-2xl p-6 md:p-8 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] min-h-[120px] md:min-h-[160px] lg:min-h-[180px] h-full w-1/2'>
                                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-success-light mb-2 md:mb-4">ativos em uso</h3>
                                                <div className="flex h-full items-center justify-start">
                                                    <Box className="text-success-light mr-2 md:mr-4" size={32} />
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-stuff-black font-extrabold">{assets.filter(a => a.trashBin === false).length}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col justify-between border-2 border-b-4 border-danger-light rounded-2xl p-6 md:p-8 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] min-h-[120px] md:min-h-[160px] lg:min-h-[180px] h-full w-1/2'>
                                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-danger-light mb-2 md:mb-4">ativos na lixeira</h3>
                                                <div className="flex h-full items-center justify-start">
                                                    <Box className="text-danger-light mr-2 md:mr-4" size={32} />
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-stuff-black font-extrabold">{assets.filter(a => a.trashBin === true).length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-between border-2 border-b-4 border-stuff-light rounded-2xl p-6 md:p-8 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] min-h-[120px] md:min-h-[160px] lg:min-h-[180px] h-full w-full'>
                                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-stuff-light mb-2 md:mb-4">membros</h3>
                                            <div className="flex h-full items-center justify-start">
                                                <User className="text-stuff-light mr-2 md:mr-4" size={32} />
                                                <span className="text-3xl md:text-5xl lg:text-6xl text-stuff-black font-extrabold">{members.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Charts Column */}
                                <div className="flex flex-col gap-2 h-full">
                                    <div className="flex flex-col gap-2 h-full">
                                        <div className="w-full h-[220px] md:h-[260px] lg:h-[320px]">
                                            <AssetRegistrationChart data={assetRegistrationsByDay} />
                                        </div>
                                        <div className="w-full h-[220px] md:h-[260px] lg:h-[320px]">
                                            <ReportTimelineChart data={reportTimelineData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};


export default SpecificOrganizationPage;
