"use client"

import Head from 'next/head';
import '../../styles/dashboard.css';
import Header from '@/components/header/header';
import { useUser } from "../../context/UserContext"

export default function Dashboard() {
  const { user } = useUser();
  return (
      <>
        <Header activeTab='home' />
        <main className="main">
          <h1> Seu painel{user && user.firstName ? `, ${user.firstName}!` : ""}</h1>
          <p>Acompanhe tudo de um lugar só</p>

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
      </>
  );
}
