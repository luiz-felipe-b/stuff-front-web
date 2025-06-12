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

export const organizationService = {

  async getAllOrganizations() {
    const token = await ensureToken();
    const response = await api.get('/organizations/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getOrganizationsByUserId(identifier: string) {
    const token = await ensureToken();
    const response = await api.get(`/organizations/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async createOrganization(data: {
    name: string;
    slug: string;
    description: string;
    password: string;
  }) {
    const token = await ensureToken();
    const response = await api.post('/organizations/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async deleteOrganization(id: string) {
    const token = await ensureToken();
    const response = await api.delete(`/organizations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getMembers(orgId: string) {
    const token = await ensureToken();
    const response = await api.get(`/organizations/${orgId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async addMember(orgId: string, member: { userId: string; role: string }) {
    const token = await ensureToken();
    const response = await api.post(`/organizations/${orgId}/members`, member, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateMemberRole(orgId: string, userId: string, role: string) {
    const token = await ensureToken();
    const response = await api.put(
      `/organizations/${orgId}/members/${userId}`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async deleteMember(orgId: string, userId: string) {
    const token = await ensureToken();
    const response = await api.delete(`/organizations/${orgId}/members/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
