import api from './api';

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async loginAdmin() {
    try {
      if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL || !process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        throw new Error("Credenciais de administrador não configuradas");
      }

      const response = await api.post('/auth/login', {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim(),
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD.trim(),
      });

      if (!response.data?.accessToken) {
        throw new Error("Token de acesso não recebido");
      }

      console.log('Admin logado com sucesso');
      return response.data.accessToken;
    } catch (error: any) {
      console.error('Erro detalhado no loginAdmin:', {
        message: error.message,
        responseData: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          data: error.config?.data
        }
      });
      throw new Error(error.response?.data?.message || "Falha ao logar como administrador");
    }
  },

  async loginUser(data: LoginData) {
    try {
      const response = await api.post('/auth/login', {
        email: data.email.trim(),
        password: data.password.trim(),
      });
      return response.data.accessToken;
    } catch (error: any) {
      console.error('Erro no loginUser:', error.response?.data || error.message);
      throw error;
    }
  },
};