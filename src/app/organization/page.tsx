"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizationsApi } from "@/services/api";
import { useUser } from "@/context/UserContext";
import { useSelectedOrganization, Organization as OrgType } from "@/context/SelectedOrganizationContext";
import Loader from "@/components/Loader/Loader";
import OrganizationList from "@/components/OrganizationList/OrganizationList";
import Header from "@/components/header/header";

const SelectOrganizationPage = () => {
    const { user } = useUser();
    const { setOrganization } = useSelectedOrganization();
    const [organizations, setOrganizations] = useState<OrgType[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) fetchUserOrganizations();
    }, [user]);

    async function fetchUserOrganizations() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await organizationsApi.getOrganizationsusersUserIdorganizations({
                params: { userId: user ? user.id : "" },
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setOrganizations(response.data || []);
        } catch {
            setOrganizations([]);
        }
        setLoading(false);
    }

    const handleSelect = (org: OrgType) => {
        setOrganization(org);
        router.push(`/organization/${org.slug}`);
    };

    return (
        <div className="h-full w-full flex items-center flex-col p-8">
            <Header activeTab="" showNav={false} />
            <div className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
                <h1 className="text-2xl font-bold mb-4 text-stuff-mid">Escolha uma organização</h1>
                <OrganizationList
                    organizations={organizations}
                    loading={loading}
                    onSelect={handleSelect}
                    onDelete={() => { }}
                    showDeleteModal={false}
                    selectedOrg={null}
                    onCancelDelete={() => { }}
                    onConfirmDelete={async () => { }}
                />
            </div>
        </div>
    );
};

export default SelectOrganizationPage;
