import React, { useState } from "react";
import ReportCard from "./ReportCard";
import PaginationControls from "@/components/PaginationControls/PaginationControls";
import Input from "@/components/Input/Input";
import ToggleButton from "@/components/Button/ToggleButton";
import Button from "@/components/Button/Button";
import { ArrowDown, ArrowUp, Search, RefreshCw } from "lucide-react";
import Loader from "../Loader/Loader";

export interface Report {
    id: string;
    title: string;
    file_url?: string;
    authorId?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ReportListProps {
    reports: Report[];
    loading?: boolean;
    onReload?: () => Promise<void>;
}

const PAGE_SIZE = 10;
const ReportList: React.FC<ReportListProps> = ({ reports, loading = false, onReload }) => {
    const [page, setPage] = useState(1);
    const [reloading, setReloading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAsc, setSortAsc] = useState(false);
    const [sortDesc, setSortDesc] = useState(true);

    // Search and sort logic
    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedReports = [...filteredReports].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (sortAsc) return dateA - dateB;
        return dateB - dateA;
    });
    const totalPages = Math.ceil(sortedReports.length / PAGE_SIZE) || 1;
    const paginatedReports = sortedReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Toggle logic
    const handleSortAsc = () => {
        setSortAsc(true);
        setSortDesc(false);
        setPage(1);
    };
    const handleSortDesc = () => {
        setSortAsc(false);
        setSortDesc(true);
        setPage(1);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                <Input
                    type="text"
                    icon={<Search size={16} />}
                    placeholder="buscar relatório"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full md:w-1/2"
                />
                <div className="flex gap-2">
                    <ToggleButton
                        pressed={sortDesc}
                        onClick={handleSortDesc}
                        title="ordenar por data decrescente"
                        aria-label="Ordenar por data decrescente"
                    >
                        <ArrowDown className="my-2" />
                    </ToggleButton>
                    <ToggleButton
                        pressed={sortAsc}
                        onClick={handleSortAsc}
                        title="ordenar por data crescente"
                        aria-label="Ordenar por data crescente"
                    >
                        <ArrowUp className="my-2" />
                    </ToggleButton>
                    {onReload && (
                        <Button
                            size="md"
                            palette="default"
                            title="recarregar relatórios"
                            onClick={async () => {
                                setReloading(true);
                                await onReload();
                                setReloading(false);
                            }}
                            disabled={reloading}
                        >
                            <RefreshCw className={reloading ? "animate-spin" : ""} />
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex flex-col py-2 px-2 h-[48vh] gap-2 border-2 border-t-8 border-stuff-light rounded-2xl w-full bg-stuff-white">

                {loading || reloading ? (
                    <Loader size={24} />
                ) : !sortedReports.length ? (
                    <div className="py-8 text-center text-stuff-gray-200">nenhum relatório encontrado.</div>
                ) : (
                    <>
                        {paginatedReports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </>
                )}
            </div>
            <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </>

    );
};

export default ReportList;
