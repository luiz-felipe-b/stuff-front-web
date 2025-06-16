import api from './api';

interface LoginData {
  email: string;
  password: string;
}

interface ResetPassword {
  token: string;
  newPassword: string;
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
      console.log('Tentando logar usuário:', data);
      const response = await api.post('/auth/login', {
        email: data.email.trim(),
        password: data.password.trim(),
      });
      console.log('Resposta do login:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro no loginUser:', error.response?.data || error.message);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.trim()
      })

      return response;
    } catch (error: any) {
      console.error("Error while trying to send the e-mail: ", error.response?.data || error.message);
      throw error;
    }
  },

  async resetPassword(resetPassword: ResetPassword) {

    try {
      const response = await api.post("/auth/reset-password", {
        token: resetPassword.token,
        newPassword: resetPassword.newPassword
      });

      return response;
    } catch (error: any) {
      console.error("Error while trying to reset the password: ", error.response?.data || error.message);
      throw error;
    }
    
  }
};