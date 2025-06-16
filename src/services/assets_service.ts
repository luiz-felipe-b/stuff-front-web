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

export const AssetService = {

    async getAllAssets() {
      const token = await ensureToken();
      try {
        const response = await api.get('/assets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || 'Erro desconhecido';
    
          if (status === 401) throw new Error(`Unauthorized ${message}`);
          if (status === 403) throw new Error(`Forbidden ${message}`);
          if (status === 500) throw new Error(`Internal Server Error ${message}`);
    
          throw new Error(`Error: ${status}: ${message}`);
        }
        throw new Error('Erro ao conectar com o servidor');
      }
    },
    
    async createAssetInstance(data: {
      organizationId: string;
      templateId: string;
      name: string;
      description: string;
    }) {
      const token = await ensureToken();
      try {
        const response = await api.post('/assets/', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || 'Erro desconhecido';
    
          if (status === 401) throw new Error(`Unauthorized ${message}`);
          if (status === 403) throw new Error(`Forbidden ${message}`);
          if (status === 500) throw new Error(`Internal Server Error ${message}`);
    
          throw new Error(`Error: ${status}: ${message}`);
        }
        throw new Error('Erro ao conectar com o servidor');
      }
    },

}