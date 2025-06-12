"use client"

import { useEffect, useState } from 'react';
import { adminService } from '../../../services/admin_service';
import '../../styles/admin.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  tier: string;
  active: boolean;
  authenticated: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  async function fetchUsers() {
    try {
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
      setErrorMsg('');
    } catch (err: any) {
      handleApiError(err);
    }
  }

  async function fetchUserByIdOrEmail(identifier: string) {
    try {
      const user = await adminService.getUserByIdentifier(identifier);
      setSelectedUser(Array.isArray(user) ? user[0] : user);
      setErrorMsg('');
    } catch (err: any) {
      handleApiError(err);
    }
  }

  async function deleteUser(id: string) {
    const confirmed = confirm('Deseja realmente excluir este usuário?');
    if (!confirmed) return;

    try {
      await adminService.deleteUser(id);
      alert('Usuário deletado com sucesso');
      fetchUsers();
      setSelectedUser(null);
      setErrorMsg('');
    } catch (err: any) {
      handleApiError(err);
    }
  }

  function handleApiError(err: any) {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setErrorMsg(`Requisição inválida: ${err.response.data?.message || ''}`);
          break;
        case 401:
          setErrorMsg(`Não autorizado: ${err.response.data?.message || ''}`);
          break;
        case 403:
          setErrorMsg(`Acesso proibido: ${err.response.data?.message || ''}`);
          break;
        case 404:
          setErrorMsg(`Não encontrado: ${err.response.data?.message || ''}`);
          break;
        case 409:
          setErrorMsg(`Conflito: ${err.response.data?.message || ''}`);
          break;
        case 500:
          setErrorMsg(`Erro interno do servidor: ${err.response.data?.message || ''}`);
          break;
        default:
          setErrorMsg(`Erro: ${err.response.data?.message || 'Erro desconhecido.'}`);
      }
    } else {
      setErrorMsg(err.message || 'Erro desconhecido.');
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  function nextPage() {
    setCurrentPage((prev) => prev + 1);
  }
  function prevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  return (
    <div className="admin-container">
      <h1>Administração de Usuários</h1>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar por ID ou Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchUserByIdOrEmail(search)}>Buscar</button>
      </div>

      {selectedUser && selectedUser.id && (
        <div className="user-details">
          <h2>Detalhes do Usuário</h2>
          <p><strong>Nome:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Tier:</strong> {selectedUser.tier}</p>
          <p><strong>Status:</strong> {selectedUser.active ? 'Ativo' : 'Inativo'}</p>
          <button
            className="danger"
            onClick={() => {
              console.log("Id enviado:", selectedUser.id);
              deleteUser(selectedUser.id);
            }}
          >
            Excluir
          </button>
        </div>
      )}

      <h2>Todos os Usuários</h2>
      <ul className="user-list" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
        {currentUsers.map((user) => (
          <li key={user.id}>
            <div>
              <p><strong>{user.userName}</strong> ({user.email})</p>
              <p>Role: {user.role} | Tier: {user.tier}</p>
            </div>
            <button className="danger" onClick={() => deleteUser(user.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <div className = '.pagination-buttons' style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage}</span>
        <button onClick={nextPage} disabled={indexOfLastUser >= users.length}>Próxima</button>
      </div>
    </div>
  );
}