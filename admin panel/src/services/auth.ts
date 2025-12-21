import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';
import type { LoginCredentials, LoginResponse } from '../types/auth.validator';

// Login api call function
export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
};
