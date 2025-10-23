"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { organizationsApi, reportsApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import Header from "@/components/Header/Header";
import { ClipboardList, Download } from "lucide-react";
import Button from "@/components/Button/Button";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";

function parseCSV(csv: string) {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));
    return { headers, rows };
}

const ReportDetailPage = () => {
    // Helper to format ISO date strings to DD/MM/YYYY HH:mm
    function formatDate(value: string) {
        // Match ISO date format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            }
        }
        return value;
    }
    // Map English column names to Portuguese
    const columnTranslations: Record<string, string> = {
        "assetName": "nome do ativo",
        "assetId": "id do ativo",
        "creationDate": "criado em",
        "updateDate": "atualizado em",
        "found": "encontrado",
        "scanDate": "data da varredura",
    };

    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const [loading, setLoading] = useState(true);
    const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
    const [csvRaw, setCsvRaw] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<any>(null);
    const { organization } = useSelectedOrganization();

    useEffect(() => {
        if (!organization) {
            router.replace("/organization");
            return;
        }
        async function fetchReportAndCSV() {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                // Fetch report entity
                const resp = await organizationsApi.getOrganizationsIdreports({ params: { id: organization?.id ?? "" }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
                const foundReport = (resp.data || []).find((r: any) => r.id === id);
                if (!foundReport || !foundReport.file_url) throw new Error("Arquivo do relatório não encontrado.");
                setReport(foundReport);

                const url = new URL(foundReport.file_url);
                let key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
                key = decodeURIComponent(key);

                const presignedResp = await reportsApi.getReportsdownload({
                    queries: { key },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const presignedUrl = presignedResp.data?.url;
                if (!presignedUrl) throw new Error("Falha ao obter URL de download do relatório.");

                const csvResp = await fetch(presignedUrl);
                if (!csvResp.ok) throw new Error("Falha ao baixar CSV.");
                const csvText = await csvResp.text();
                setCsvRaw(csvText);
                setCsvData(parseCSV(csvText));
            } catch (err: any) {
                setError(err.message || "Erro ao carregar relatório.");
                toast.error(err.message || "Erro ao carregar relatório.");
            }
            setLoading(false);
        }
        if (organization.id && id) fetchReportAndCSV();
    }, [organization?.id, id]);

    // Download CSV handler (top-level)
    function handleDownloadCSV() {
        if (!csvRaw) return;
        const blob = new Blob([csvRaw], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio-${id}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="h-full w-full flex items-center flex-col p-8">
            <Header activeTab="reports" organizationName={organization?.name} />
            <main className="w-full h-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-8 flex flex-col border-2 border-stuff-light">
                <Breadcrumb
                    items={[
                        { label: "Relatórios", href: `/organization/${organization?.slug}/reports` },
                        { label: report?.createdAt ? `Detalhe do relatório (${formatDate(report.createdAt)})` : `Detalhe do relatório`, href: `/organization/${organization?.slug}/reports/${id}` },
                    ].filter(Boolean)}
                    className="mb-4"
                />
                <div className="flex items-center justify-between gap-2 mb-2 text-stuff-light">
                    <div className="flex items-center gap-2 mb-4 text-stuff-light">
                        <ClipboardList />
                        <h1 className="text-2xl font-extrabold">Dados do relatório</h1>
                    </div>
                    <div className="mb-4 flex justify-end">
                        <Button
                            palette="default"
                            variant="primary"
                            size="md"
                            title="baixar csv"
                            aria-label="Baixar relatório como CSV"
                            onClick={handleDownloadCSV}
                            disabled={loading || !csvRaw}
                            className="py-3"
                        >
                            <Download size={24} />
                        </Button>
                    </div>
                </div>
                

                {loading ? (
                    <div className="flex items-center justify-center h-[60vh] w-full">
                        <Loader />
                    </div>
                ) : (
                    <>

                        <div className="overflow-auto border-2 border-t-4 border-stuff-light rounded-xl bg-stuff-white">
                            <div
                                className="grid text-sm"
                                style={{ gridTemplateColumns: `repeat(${csvData.headers.length}, minmax(120px, 1fr))` }}
                            >
                                {/* Header row */}
                                {csvData.headers.map((h, i) => (
                                    <div
                                        key={i}
                                        className="px-4 py-2 bg-stuff-light text-stuff-white font-bold border-b border-stuff-light"
                                    >
                                        {columnTranslations[h.trim()] || h}
                                    </div>
                                ))}
                                {/* Data rows */}
                                {csvData.rows.map((row, i) =>
                                    row.map((cell, j) => {
                                        let displayValue = cell;
                                        if (cell.trim() === "") displayValue = "?";
                                        else if (cell.trim().toLowerCase() === "true") displayValue = "Sim";
                                        else if (cell.trim().toLowerCase() === "false") displayValue = "Não";
                                        else displayValue = formatDate(cell);
                                        return (
                                            <div
                                                key={`${i}-${j}`}
                                                className={`px-4 py-2 text-stuff-light border-b border-stuff-light ${i % 2 === 0 ? 'bg-stuff-white' : 'bg-stuff-light/10'}`}
                                                style={{ borderRight: (j === csvData.headers.length - 1) ? 'none' : undefined }}
                                            >
                                                {displayValue}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
};

export default ReportDetailPage;
