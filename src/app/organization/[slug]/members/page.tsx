"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { assetsApi, organizationsApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import AssetList from "@/components/AssetList/AssetList";
import { Users } from "lucide-react";
import MemberList from "@/components/MemberList/MemberList";



const OrganizationMembersPage = () => {
	const router = useRouter();
	const { organization } = useSelectedOrganization();
	const [members, setMembers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [reloading, setReloading] = useState(false);

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
		} finally {
			if (showLoader) setLoading(false);
		}
	};

	useEffect(() => {
		if (!organization) {
			router.replace("/organization");
			return;
		}
		fetchMembers();
	}, [organization, router]);

	const onUpdateRole = async (userId: string, newRole: string) => {
		if (newRole !== "admin" && newRole !== "user") {
			setError("Papel inválido.");
			return;
		}
		if (!organization) {
			setError("Organização não selecionada.");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await organizationsApi.patchOrganizationsIdmembersUserId({ role: newRole }, {
				params: { id: organization.id, userId },
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});
			fetchMembers(false);
		} catch (err) {
			setError("Erro ao atualizar papel do membro.");
		}
	};

	const onDelete = async (userId: string) => {
		if (!organization) {
			setError("Organização não selecionada.");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await organizationsApi.deleteOrganizationsIdmembersUserId(undefined, {
				params: { id: organization.id, userId },
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});
			fetchMembers(false);
		} catch (err) {
			setError("Erro ao remover membro.");
		}
	};

	const onAddMember = async (email: string) => {
		try {
			// const token = localStorage.getItem("token");
			// await organizationsApi.postOrganizationsIdmembers({
			// 	params: { id: organization.id },
			// 	data: { email },
			// 	headers: token ? { Authorization: `Bearer ${token}` } : {},
			// });
			// fetchMembers(false);
		} catch (err) {
			setError("Erro ao adicionar membro.");
		}
	};

	const onReload = async () => {
		setReloading(true);
		await fetchMembers(false);
		setReloading(false);
	};

	const onSearchTermChange = (term: string) => setSearchTerm(term);

	if (!organization) {
		return null;
	}

		return (
			<div className="h-full w-full flex items-center flex-col p-8">
				<Header activeTab="members" organizationName={organization.name} />
				<main className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
					<div className="flex items-center gap-2 mb-2 text-stuff-light">
						<Users/>
						<h1 className="text-2xl font-extrabold">Membros</h1>
					</div>
					<div className="mb-4 text-stuff-gray-200">
						esses são os membros da organização
					</div>
					{loading ? (
						<Loader />
					) : error ? (
						<div className="text-red-500">{error}</div>
					) : (
						<MemberList
							members={filteredMembers}
							loading={loading}
							onUpdateRole={onUpdateRole}
							onDelete={onDelete}
							onAddMember={onAddMember}
							onReload={onReload}
							searchTerm={searchTerm}
							onSearchTermChange={onSearchTermChange}
							reloading={reloading}
						/>
					)}
				</main>
			</div>
		);
};

export default OrganizationMembersPage;