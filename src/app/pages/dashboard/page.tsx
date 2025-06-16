import Head from 'next/head';
import '../../styles/dashboard.css';
import Header from '@/app/components/header/header';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Sistema de Ativos</title>
      </Head>
      <div className="dashboard-container">
        <Header activeTab='home' />
        <main className="main">
          <h1>Bem-vindo ao seu painel!</h1>
          <p>Acompanhe e gerencie seus ativos com facilidade.</p>

          <div className="cards">
            <div className="card">
              <h3>Ativos Cadastrados</h3>
              <span>152</span>
            </div>
            <div className="card">
              <h3>Organizações</h3>
              <span>12</span>
            </div>
            <div className="card">
              <h3>Últimos Acessos</h3>
              <span>09/05/2025</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
