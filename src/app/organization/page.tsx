"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizationsApi } from "@/services/api";
import { useUser } from "@/context/UserContext";
import { useSelectedOrganization, Organization as OrgType } from "@/context/SelectedOrganizationContext";
import OrganizationList from "@/components/OrganizationList/OrganizationList";
import Modal from "@/components/ConfirmModal/ConfirmModal";
import Input from "@/components/Input/Input";
import Header from "@/components/Header/Header";
import { Building } from "lucide-react";

const SelectOrganizationPage = () => {
    const { user } = useUser();
    const { setOrganization } = useSelectedOrganization();
    const [organizations, setOrganizations] = useState<OrgType[]>([]);
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [newOrgName, setNewOrgName] = useState("");
    const [newOrgDesc, setNewOrgDesc] = useState("");
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
                <div className="flex gap-2 items-center mb-4">
                    <Building className="text-stuff-light mr-2 inline-block" />
                    <h1 className="text-2xl font-bold text-stuff-light">Escolha uma organização</h1>
                </div>
                <OrganizationList
                    organizations={organizations}
                    loading={loading}
                    onSelect={handleSelect}
                    onDelete={() => { }}
                    showDeleteModal={false}
                    selectedOrg={null}
                    onCancelDelete={() => { }}
                    onConfirmDelete={async () => { }}
                    onAddOrganization={() => setAddModalOpen(true)}
                />
            </div>
            {/* Add Organization Modal */}
            <Modal
                open={addModalOpen}
                message="Preencha as informações para criar uma nova organização."
                // loading prop removed; handle loading state in content or button if needed
                onCancel={() => {
                    setAddModalOpen(false);
                    setAddError(null);
                    setNewOrgName("");
                    setNewOrgDesc("");
                }}
                onConfirm={async () => {
                    setAddLoading(true);
                    setAddError(null);
                    try {
                        const token = localStorage.getItem("token");
                        await organizationsApi.postOrganizations(
                            {
                                name: newOrgName,
                                slug: newOrgName
                                    .normalize("NFD")
                                    .replace(/\p{Diacritic}/gu, "")
                                    .toLowerCase()
                                    .replace(/\s+/g, "-"),
                                description: newOrgDesc,
                            }, {
                                headers: token ? { Authorization: `Bearer ${token}` } : {},
                            }
                        );
                        setAddModalOpen(false);
                        setNewOrgName("");
                        setNewOrgDesc("");
                        await fetchUserOrganizations();
                    } catch (err: any) {
                        console.error(err)
                        setAddError("Erro ao criar organização. Tente novamente.");
                    }
                    setAddLoading(false);
                }}
                confirmLabel="Criar"
                cancelLabel="Cancelar"
            >
                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-sm font-medium text-stuff-light">Nome da organização
                        <Input
                            type="text"
                            value={newOrgName}
                            onChange={e => setNewOrgName(e.target.value)}
                            required
                            maxLength={60}
                        />
                    </label>
                    <label className="text-sm font-medium text-stuff-light">Descrição
                        <Input
                            type="text"
                            value={newOrgDesc}
                            onChange={e => setNewOrgDesc(e.target.value)}
                            maxLength={120}
                        />
                    </label>
                    {addError && <div className="text-danger-base text-sm mt-2">{addError}</div>}
                </div>
            </Modal>
        </div>
    );
};

export default SelectOrganizationPage;
