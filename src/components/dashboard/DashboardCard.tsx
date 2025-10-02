import React from "react";

interface DashboardCardProps {
  title: string;
  value: React.ReactNode;
  bgClass?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, bgClass = "bg-stuff-white" }) => (
  <div className={`flex flex-col items-center ${bgClass} border-2 border-b-4 border-black rounded-xl p-6 shadow-none`}>
    <h3 className="text-lg font-semibold text-stuff-dark mb-2">{title}</h3>
    <span className="text-3xl font-bold text-stuff-black">{value}</span>
  </div>
);

export default DashboardCard;
