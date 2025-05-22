import api from './api';
import { authService } from './login_service';

interface RegisterData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export const RegisterService = {
  async register(data: RegisterData) {
    try {
      console.log("Iniciando registro...");
      
      const adminToken = await authService.loginAdmin();
      if (!adminToken || typeof adminToken !== 'string' || adminToken.trim() === '') {
        throw new Error("Token do admin inválido ou não obtido");
      }
      console.log("Token do admin obtido com sucesso");

      if (!data.firstName || !data.lastName || !data.userName || !data.email || !data.password) {
        throw new Error("Todos os campos são obrigatórios");
      }

      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        userName: data.userName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: "user",
        tier: "free",
      };

      console.log('Enviando payload:', payload);

      const response = await api.post('users/', payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Registro realizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado no registro:', {
        message: error.message,
        stack: error.stack,
        responseData: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};