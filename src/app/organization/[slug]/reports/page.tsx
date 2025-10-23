"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { organizationsApi } from "@/services/api";
import { ClipboardList } from "lucide-react";
import ReportList from "@/components/ReportList/ReportList";
import Loader from "@/components/Loader/Loader";

const OrganizationMembersPage = () => {
    const router = useRouter();
    const { organization } = useSelectedOrganization();
    const [members, setMembers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const resp = await organizationsApi.getOrganizationsIdmembers({ params: { id: organization?.id || "" }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            setMembers(resp.data || []);
        } catch (err) {
            setError("Erro ao carregar membros.");
        } finally {
            if (showLoader) setLoading(false);
        }
        };
    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");
            const resp = await organizationsApi.getOrganizationsIdreports({ params: { id: organization?.id || "" }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            setReports(resp.data || []);
        } catch (err) {
            setError("erro ao carregar relatórios.");
        }
    };

    useEffect(() => {
        if (!organization) {
            router.replace("/organization");
            return;
        }
        fetchMembers();
        fetchReports();
    }, [organization, router]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (!organization) {
        return null;
    }

    return (
        <div className="h-full w-full flex items-center flex-col p-8">
            <Header activeTab="reports" organizationName={organization.name} />
            <main className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
                <div className="flex items-center gap-2 mb-2 text-stuff-light">
                    <ClipboardList />
                    <h1 className="text-2xl font-extrabold">Relatórios</h1>
                </div>
                <div className="mb-4 text-stuff-gray-200">
                    esses são os seus relatórios
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-[60vh] w-full">
                        <Loader />
                    </div>
                ) : (
                    <ReportList reports={reports} loading={loading} onReload={fetchReports} />
                )}
            </main>
        </div>
    );
};

export default OrganizationMembersPage;