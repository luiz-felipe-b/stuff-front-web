"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organizationsApi } from "@/services/api";
import { adminService } from "../../services/admin_service"; // Para buscar userId pelo email
// import "../../styles/organizacao.css";
import Header from "@/components/header/header";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import DeleteOrganizationModal from "@/components/OrganizationList/DeleteOrganizationModal";
import CreateOrganizationModal from "@/components/OrganizationList/CreateOrganizationModal";
import Loader from "@/components/Loader/Loader";
import { ListItem } from "@/components/list";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
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
    name: "",
    description: "",
    password: "",
    slug: "",
  });

  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // Buscar todas as organizações ao carregar a página

  useEffect(() => {
    fetchUserOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserOrganizations() {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("token");
      const response = await organizationsApi.getOrganizationsusersUserIdorganizations({  params: { userId: user ? user.id : "" },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrganizations(response.data || []);
    } catch (err) {
      setErrorMsg("Erro ao buscar organizações. Tente novamente mais tarde.");
    }
    setLoading(false);
  }



  const handleSelectOrg = (org: Organization) => {
    router.push(`/organization/${org.id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (selectedOrg) {
        setErrorMsg("Atualização de organização não implementada.");
      } else {
        const token = localStorage.getItem("token");
        await organizationsApi.postOrganizations({
          name: form.name,
          slug: form.slug,
          description: form.description,
          password: form.password,
        }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        await fetchUserOrganizations();
        setForm({ name: "", description: "", password: "", slug: "" });
        setSuccessMsg("Organização criada com sucesso!");
        setShowCreateModal(false); // Fechar modal após criar
      }
      setSelectedOrg(null);
    } catch (err) {
      setErrorMsg(
        "Erro ao salvar organização. Verifique os dados e tente novamente."
      );
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setForm({ name: "", description: "", password: "", slug: "" });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDelete = async () => {
    if (selectedOrg) {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const token = localStorage.getItem("token");
        await organizationsApi.patchOrganizationsIddeactivate(undefined, { params: { id: selectedOrg.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
        await fetchUserOrganizations();
        setSelectedOrg(null);
        setForm({ name: "", description: "", password: "", slug: "" });
        setSuccessMsg("Organização deletada com sucesso!");
      } catch (err) {
        setErrorMsg("Erro ao deletar organização. Tente novamente.");
      }
      setLoading(false);
    }
  };







  return (
    <>
      <div className="bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px]">
        <main className="min-h-screen flex flex-col items-center justify-start px-4">
          <Header activeTab="organization" />
          <section className="w-full bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] flex flex-col items-center py-10 px-6 md:px-16">
            {/* {successMsg && <div className="success-message mb-4">{successMsg}</div>}
            {errorMsg && <div className="error-message mb-4">{errorMsg}</div>} */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 w-full">
              <div>
                <h1 className="text-3xl font-bold text-stuff-mid mb-1">Minhas Organizações</h1>
                <p className="text-stuff-dark text-lg">Junte a galera e seus ativos!</p>
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  variant="primary"
                  palette="default"
                  size="md"
                  iconBefore={<RefreshCcw className={loading ? "animate-spin" : ""} />}
                  onClick={fetchUserOrganizations}
                  title="Atualizar"
                  disabled={loading}
                  aria-label="Atualizar"
                />
                <Button
                  variant="primary"
                  palette="default"
                  size="md"
                  iconBefore={<Plus />}
                  onClick={() => setShowCreateModal(true)}
                  title="Nova organização"
                  aria-label="Nova organização"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full min-h-[180px]">
              {loading ? (
                <Loader label="Carregando organizações..." />
              ) : organizations.length === 0 ? (
                <div className="text-center text-stuff-gray-100 py-8">Nenhuma organização encontrada.</div>
              ) : (
                organizations.map((org) => (
                  <ListItem
                    key={org.id}
                    onClick={() => handleSelectOrg(org)}
                    rightContent={
                      <Button
                        variant="primary"
                        palette="danger"
                        size="sm"
                        iconBefore={<Trash />}
                        className="ml-2"
                        title="Deletar organização"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrg(org);
                          setShowDeleteModal(true);
                        }}
                      />
                    }
                  >
                    <span className="font-semibold text-lg text-stuff-black truncate max-w-[200px]">{org.name}</span>
                    <span className="text-stuff-dark truncate max-w-[300px]">{org.description}</span>
                  </ListItem>
                ))
              )}

              <DeleteOrganizationModal
                open={showDeleteModal && !!selectedOrg}
                orgName={selectedOrg?.name || ''}
                loading={loading}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                  await handleDelete();
                  setShowDeleteModal(false);
                }}
              />
            </div>
          </section>
        </main>
      </div>


      <CreateOrganizationModal
        open={showCreateModal}
        loading={loading}
        form={form}
        onChange={handleChange}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />

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

export default OrganizacoesPage;
