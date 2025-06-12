import api from './api';
import { authService } from './login_service';

let adminToken: string | null = null;

async function ensureToken() {
  if (!adminToken) {
    const token = await authService.loginAdmin();
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error("Token do admin inválido ou não obtido");
    }
    adminToken = token;
    console.log("Token do admin obtido com sucesso");
  }
  return adminToken;
}

export const adminService = {
  async getAllUsers() {
    const token = await ensureToken();
    const response = await api.get('/users/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  async getUserByIdentifier(identifier: string) {
    const token = await ensureToken();
    const response = await api.get(`/users/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

    async deleteUser(id: string) {
      const token = await ensureToken();
      const response = await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    }
};