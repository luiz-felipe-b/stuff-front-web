import React from "react";
import { useRouter } from "next/navigation";
import { Report } from "./ReportList";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";

interface ReportCardProps {
    report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {

    const router = useRouter();
    const { organization } = useSelectedOrganization();
    const handleClick = () => {
        if (report.id && organization?.slug) {
            router.push(`/organization/${organization.slug}/reports/${report.id}`);
        }
    };
    return (
        <div
            className="cursor-pointer bg-stuff-white hover:bg-stuff-light/10 border-2 border-stuff-light rounded-xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === "Enter") handleClick();
            }}
        >
            <div className="font-bold text-stuff-light text-lg mb-1">{report.title}</div>
            <div className="text-xs text-stuff-gray-200">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ""} {report.createdAt ? new Date(report.createdAt).toLocaleTimeString() : ""}</div>
        </div>
    );
};

export default ReportCard;
