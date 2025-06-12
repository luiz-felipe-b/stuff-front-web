"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { organizationService } from '../../../services/organization_service';
import { adminService } from '../../../services/admin_service'; // Para buscar userId pelo email
import '../../styles/organizacao.css';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Member {
  id: string;
  email: string;
  role: string;
}

const OrganizacoesPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    password: '',
    slug: ''
  });
  
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('membro');
  const [loading, setLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  // Buscar todas as organizações ao carregar a página
  useEffect(() => {
    fetchAllOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAllOrganizations() {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await organizationService.getAllOrganizations();
      setOrganizations(response?.data || response || []);
    } catch (err) {
      setErrorMsg("Erro ao buscar organizações. Tente novamente mais tarde.");
    }
    setLoading(false);
  }

  async function fetchMembers(org: Organization) {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await organizationService.getMembers(org.id);
      setMembers(data.data || data || []);
    } catch (err) {
      setErrorMsg("Erro ao buscar membros da organização.");
    }
    setLoading(false);
  }

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setForm({
      name: org.name,
      description: org.description,
      password: '',
      slug: org.slug
    });
    fetchMembers(org);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleBackToDashboard = () => {
    router.push("/pages/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (selectedOrg) {
        setErrorMsg('Atualização de organização não implementada.');
      } else {
        await organizationService.createOrganization(form);
        await fetchAllOrganizations();
        setForm({ name: '', description: '', password: '', slug: '' });
        setSuccessMsg('Organização criada com sucesso!');
      }
      setSelectedOrg(null);
    } catch (err) {
      setErrorMsg("Erro ao salvar organização. Verifique os dados e tente novamente.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (selectedOrg) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        await organizationService.deleteOrganization(selectedOrg.id);
        await fetchAllOrganizations();
        setSelectedOrg(null);
        setForm({ name: '', description: '', password: '', slug: '' });
        setMembers([]);
        setSuccessMsg('Organização deletada com sucesso!');
      } catch (err) {
        setErrorMsg("Erro ao deletar organização. Tente novamente.");
      }
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedOrg) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (!email) {
        setErrorMsg("Informe o e-mail do usuário para adicionar.");
        setLoading(false);
        return;
      }
      // Buscar userId pelo email
      const userData = await adminService.getUserByIdentifier(email.trim());
      const userId = userData?.id;
      if (!userId) {
        setErrorMsg("Usuário não encontrado para o e-mail informado.");
        setLoading(false);
        return;
      }
      await organizationService.addMember(selectedOrg.id, { userId, role });
      await fetchMembers(selectedOrg);
      setSuccessMsg("Membro adicionado com sucesso!");
      setEmail('');
    } catch (err) {
      setErrorMsg("Erro ao adicionar membro. Verifique o e-mail e tente novamente.");
    }
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!selectedOrg) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await organizationService.updateMemberRole(selectedOrg.id, userId, newRole);
      await fetchMembers(selectedOrg);
      setSuccessMsg('Função do membro atualizada com sucesso!');
    } catch (err) {
      setErrorMsg("Erro ao atualizar a função do membro.");
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!selectedOrg) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await organizationService.deleteMember(selectedOrg.id, userId);
      await fetchMembers(selectedOrg);
      setSuccessMsg('Membro removido com sucesso!');
    } catch (err) {
      setErrorMsg("Erro ao remover membro da organização.");
    }
    setLoading(false);
  };

  return (
    <div className="organizacao-bg">
      <div className="container">
        <h1>Gerenciar Organizações</h1>
        <button
          onClick={handleBackToDashboard}
          className="back-dashboard-btn"
        >
          Voltar para Dashboard
        </button>


        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {!selectedOrg && (
          <div className="form-container">
            <h2>Nova Organização</h2>
            <input name="name" placeholder="Nome" onChange={handleChange} value={form.name} />
            <textarea name="description" placeholder="Descrição" onChange={handleChange} value={form.description} />
            <input name="password" type="password" placeholder="Senha" onChange={handleChange} value={form.password} />
            <input name="slug" placeholder="Slug" onChange={handleChange} value={form.slug} />
            <button onClick={handleSubmit} disabled={loading}>Criar</button>
          </div>
        )}

        <div className="list-container">
          <h2>Organizações</h2>
          <ul>
            {organizations.map(org => (
              <li key={org.id}>
                <span style={{ fontWeight: 500 }}>{org.name}</span>
                <div>
                  <button onClick={() => handleSelectOrg(org)} style={{ marginRight: 8 }}>Selecionar</button>
                  <button onClick={async () => {
                    setSelectedOrg(org);
                    await handleDelete();
                  }} className="danger">Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedOrg && (
          <div className="members-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ marginBottom: 0 }}>{selectedOrg.name}</h2>
              <button onClick={() => {
                setSelectedOrg(null);
                setMembers([]);
                setForm({ name: '', description: '', password: '', slug: '' });
              }}>Voltar</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Descrição:</strong> {selectedOrg.description}
              <br />
              <strong>Slug:</strong> {selectedOrg.slug}
            </div>
            <h3>Membros da Organização</h3>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email do usuário" />
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="membro">Membro</option>
            </select>
            <button onClick={handleAddUser} disabled={loading}>Adicionar</button>

            <ul>
              {members.map(user => (
                <li key={user.id}>
                  {user.email} - 
                  <select value={user.role} onChange={e => handleUpdateRole(user.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="membro">Membro</option>
                  </select>
                  <button onClick={() => handleDeleteUser(user.id)} disabled={loading} className="danger">Remover</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizacoesPage;