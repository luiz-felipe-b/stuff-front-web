"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { organizationsApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import { ClipboardList } from "lucide-react";
import MemberList from "@/components/MemberList/MemberList";
import ReportList from "@/components/ReportList/ReportList";

const OrganizationMembersPage = () => {
    const router = useRouter();
    const { organization } = useSelectedOrganization();
    const [members, setMembers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtered members based on searchTerm
    const filteredMembers = searchTerm
        ? members.filter((m) => m.email.toLowerCase().includes(searchTerm.toLowerCase()))
        : members;

    const fetchMembers = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const resp = await organizationsApi.getOrganizationsIdmembers({ params: { id: organization?.id || "" }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            setMembers(resp.data || []);
        } catch (err) {
            setError("Erro ao carregar membros.");
            toast.error("Erro ao carregar membros.");
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
            toast.error("erro ao carregar relatórios.");
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
                    Relatórios da organização
                </div>
                <ReportList reports={reports} loading={loading} onReload={fetchReports} />
                
                {/* Erros agora são exibidos via toast */}
            </main>
        </div>
    );
};

export default OrganizationMembersPage;