"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { organizationService } from "../../../../services/organization_service";
import { adminService } from "../../../../services/admin_service"; // Para buscar userId pelo email
import "../../../styles/organizacao.css";
import Header from "@/app/components/header/header";
import { Plus, Trash, X } from "lucide-react";
import Link from "next/link";

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

const SpecificOrganizationPage = () => {
  const [org, setOrg] = useState<Organization | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("membro");
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const params = useParams();
  const router = useRouter();

  const organizationId = params.id as string;

  // Buscar todas as organizações ao carregar a página
  useEffect(() => {
    if (organizationId) {
      fetchSpecificOrganization(organizationId);
    }
  }, [organizationId]);

  async function fetchSpecificOrganization(id: string) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Buscar organização específica pelo ID
      const orgResponse = await organizationService.getOrganizationById(id);
      const organization = orgResponse?.data || orgResponse;
      
      if (organization) {
        setOrg(organization);
        // Buscar membros da organização
        await fetchMembers(organization);
      }
    } catch (err) {
      setErrorMsg("Erro ao buscar organização. Verifique se o ID está correto.");
    }
    setLoading(false);
  }

  async function fetchMembers(org: Organization) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const data = await organizationService.getMembers(org.id);
      setMembers(data.data || data || []);
    } catch (err) {
      setErrorMsg("Erro ao buscar membros da organização.");
    }
    setLoading(false);
  }

  const handleSelectOrg = (org: Organization) => {
    setOrg(org);

    fetchMembers(org);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (org) {
        setErrorMsg("Atualização de organização não implementada.");
      } else {
        // await organizationService.createOrganization(form);
        // await fetchAllOrganizations();
        // setForm({ name: "", description: "", password: "", slug: "" });
        setSuccessMsg("Organização criada com sucesso!");
        setShowCreateModal(false); // Fechar modal após criar
      }
      setOrg(null);
    } catch (err) {
      setErrorMsg(
        "Erro ao salvar organização. Verifique os dados e tente novamente."
      );
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    // setForm({ name: "", description: "", password: "", slug: "" });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDelete = async () => {
    if (org) {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        await organizationService.deleteOrganization(org.id);
        // await fetchAllOrganizations();
        setOrg(null);
        // setForm({ name: "", description: "", password: "", slug: "" });
        setMembers([]);
        setSuccessMsg("Organização deletada com sucesso!");
      } catch (err) {
        setErrorMsg("Erro ao deletar organização. Tente novamente.");
      }
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!org) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
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
      await organizationService.addMember(org.id, { userId, role });
      await fetchMembers(org);
      setSuccessMsg("Membro adicionado com sucesso!");
      setEmail("");
    } catch (err) {
      setErrorMsg(
        "Erro ao adicionar membro. Verifique o e-mail e tente novamente."
      );
    }
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!org) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await organizationService.updateMemberRole(
        org.id,
        userId,
        newRole
      );
      await fetchMembers(org);
      setSuccessMsg("Função do membro atualizada com sucesso!");
    } catch (err) {
      setErrorMsg("Erro ao atualizar a função do membro.");
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!org) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await organizationService.deleteMember(org.id, userId);
      await fetchMembers(org);
      setSuccessMsg("Membro removido com sucesso!");
    } catch (err) {
      setErrorMsg("Erro ao remover membro da organização.");
    }
    setLoading(false);
  };

  return (
    <>
      <Header activeTab="organization" />
      <main className="main">
        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <h1>{org?.name}</h1>
        <p>{org?.description}</p>

      </main>

      {/* <div className="container">
        {!selectedOrg && (
          <div className="form-container">
            <h2>Nova Organização</h2>
            <input
              name="name"
              placeholder="Nome"
              onChange={handleChange}
              value={form.name}
            />
            <textarea
              name="description"
              placeholder="Descrição"
              onChange={handleChange}
              value={form.description}
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              onChange={handleChange}
              value={form.password}
            />
            <input
              name="slug"
              placeholder="Slug"
              onChange={handleChange}
              value={form.slug}
            />
            <button onClick={handleSubmit} disabled={loading}>
              Criar
            </button>
          </div>
        )}

        {selectedOrg && (
          <div className="members-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ marginBottom: 0 }}>{selectedOrg.name}</h2>
              <button
                onClick={() => {
                  setSelectedOrg(null);
                  setMembers([]);
                  setForm({
                    name: "",
                    description: "",
                    password: "",
                    slug: "",
                  });
                }}
              >
                Voltar
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Descrição:</strong> {selectedOrg.description}
              <br />
              <strong>Slug:</strong> {selectedOrg.slug}
            </div>
            <h3>Membros da Organização</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do usuário"
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="membro">Membro</option>
            </select>
            <button onClick={handleAddUser} disabled={loading}>
              Adicionar
            </button>

            <ul>
              {members.map((user) => (
                <li key={user.id}>
                  {user.email} -
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="membro">Membro</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={loading}
                    className="danger"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div> */}
    </>
  );
};

export default SpecificOrganizationPage;
