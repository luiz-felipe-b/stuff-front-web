"use client"




import React, { useEffect } from 'react';
import Header from '@/components/header/header';
import { useUser } from "../../context/UserContext";
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useUser();
  const { organization } = useSelectedOrganization();
  const router = useRouter();

  useEffect(() => {
    if (!organization) {
      router.replace('/select-organization');
    }
  }, [organization, router]);

  if (!organization) return null;

  return (
    <div className="bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
      <main className="min-h-screen flex flex-col items-center justify-start px-4">
        <Header activeTab="home" />
        <section className="w-full bg-stuff-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center py-10 px-6 md:px-16">
          <h1 className="text-3xl font-bold text-stuff-mid mb-2 text-center">
            {organization.name}
          </h1>
          <p className="text-stuff-dark text-lg mb-8 text-center">
            acompanhe tudo de um lugar só
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <DashboardCard title="Ativos Cadastrados" value={152} bgClass="bg-stuff-high" />
            <DashboardCard title="Organizações" value={12} bgClass="bg-stuff-light" />
            <DashboardCard title="Últimos Acessos" value={"09/05/2025"} bgClass="bg-stuff-white" />
          </div>
        </section>
      </main>
    </div>
  );
}
