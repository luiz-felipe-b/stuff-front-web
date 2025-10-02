"use client"



import Header from '@/components/header/header';
import { useUser } from "../../context/UserContext";
import DashboardCard from '@/components/dashboard/DashboardCard';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
      {/* Header com mesmo fundo do dashboard */}
      <Header activeTab="home" />
      <main className="min-h-screen flex flex-col items-center justify-start px-4">
        <section className="w-full bg-stuff-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center py-10 px-6 md:px-16">
          <h1 className="text-3xl font-bold text-stuff-mid mb-2 text-center">
            Seu painel{user && user.firstName ? `, ${user.firstName}!` : "!"}
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
