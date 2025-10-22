"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assetsApi, organizationsApi } from "@/services/api";
import Header from "@/components/Header/Header";
import { useUser } from "@/context/UserContext";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import DashboardCard from "@/components/DashboardCard/DashboardCard";

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
    const { organization } = useSelectedOrganization();
    const router = useRouter();
    const { user, setUser } = useUser();
    // const [members, setMembers] = useState<Member[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);

    // Require selected organization
    useEffect(() => {
        if (!organization) {
            router.replace('/organization');
        }
    }, [organization, router]);

    // Fetch assets when organization changes
    useEffect(() => {
        if (organization?.id) {
            fetchOrganizationAssets(organization.id);
        }
    }, [organization]);

    if (!user || !organization) return null;

    async function fetchOrganizationAssets(orgId: string) {
        setLoading(true);
        // removed setErrorMsg and setSuccessMsg
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
            // removed setErrorMsg
        }
        setLoading(false);
    }



    return (
        <>
            <div className="h-full w-full flex items-center flex-col p-8">
                <Header activeTab="home" organizationName={organization.name} />
                <section className="w-full bg-stuff-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center py-10 px-6 md:px-16">
                    <h1 className="text-3xl font-bold text-stuff-mid mb-2 text-center">
                        {organization.name}
                    </h1>
                    <p className="text-stuff-dark text-lg mb-8 text-center">
                        acompanhe tudo de um lugar só
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <DashboardCard title="Ativos Cadastrados" value={152} bgClass="bg-stuff-high" />
                        <DashboardCard title="Organizações" value={12} bgClass="bg-stuff-light" />
                        <DashboardCard title="Últimos Acessos" value={"09/05/2025"} bgClass="bg-stuff-white" />
                    </div>
                </section>
            </div>
        </>
    );
};


export default SpecificOrganizationPage;
