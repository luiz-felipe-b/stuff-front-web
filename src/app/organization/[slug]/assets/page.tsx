"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header/header";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { assetsApi, organizationsApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import AssetList from "@/components/AssetList/AssetList";
import { Box, Package } from "lucide-react";

const OrganizationAssetsPage = () => {
	const router = useRouter();
	const { organization } = useSelectedOrganization();
	const [assets, setAssets] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

		useEffect(() => {
			if (!organization) {
				router.replace("/organization");
				return;
			}
			const fetchAssets = async () => {
				setLoading(true);
				setError(null);
				try {
					const token = localStorage.getItem("token");
					// Fetch asset list for the org
							const assetsResp = await organizationsApi.getOrganizationsIdassets({ params: { id: organization.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
							const assetList = assetsResp.data || [];
							// Fetch each asset's full details (with attributes)
							const assetsWithAttributes = await Promise.all(
								assetList.map(async (a: any) => {
									try {
										const assetDetailResp = await assetsApi.getAssetsId({ params: { id: a.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
										const asset = assetDetailResp.data;
														return {
															...asset,
															description: asset?.description ?? "",
															organizationId: asset?.organizationId ?? "",
														};
									} catch (err) {
										// If fetching details fails, fallback to basic asset info
														return {
															...a,
															description: a?.description ?? "",
															organizationId: a?.organizationId ?? "",
														};
									}
								})
							);
							setAssets(assetsWithAttributes);
				} catch (err) {
					setError("Erro ao carregar ativos.");
				} finally {
					setLoading(false);
				}
			};
			fetchAssets();
		}, [organization, router]);

	if (!organization) {
		return null;
	}

	return (
		<div className="h-full w-full flex items-center flex-col p-8">
			<Header activeTab="assets" />
			<main className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
                <div className="flex items-center gap-2 mb-2 text-stuff-light">
                    <Package/>
				    <h1 className="text-2xl font-extrabold">Ativos de {organization.name}</h1>
                </div>
                <div className="mb-4 text-stuff-dark">
                    seus ativos estão aqui
                </div>
				{loading ? (
					<Loader />
				) : error ? (
					<div className="text-red-500">{error}</div>
				) : (
					<AssetList  assets={assets} organization={organization} loading={loading} />
				)}
			</main>
		</div>
	);
};

export default OrganizationAssetsPage;