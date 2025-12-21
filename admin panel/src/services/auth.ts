import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdByAdminId: number | null;
  createdAt: string;
  updatedAt: string;
  hashedPassword: string | null;
}

interface LoginResponse {
  token: string;
  account: Account;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};
