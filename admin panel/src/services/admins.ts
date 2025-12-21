import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';

// Service to get paginated admins
export async function getPaginatedAdmins(
    page = 1,
    limit = 10,
    status: 'active' | 'deleted' | 'all' = 'active'
) {
    const response = await api.get(API_ENDPOINTS.ADMINS, {
        params: { page, limit, status }
    });
    return response.data;
}

// Service to create a new admin
export async function createAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}) {
    const response = await api.post(API_ENDPOINTS.ADMINS, data);
    return response.data;
}

// Service to toggle admin status (delete/activate)
export async function toggleAdminStatus(id: number) {
    const response = await api.delete(`${API_ENDPOINTS.ADMINS}/${id}`);
    return response.data;
}

// Service to update admin
export async function updateAdmin(id: number, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
}) {
    const response = await api.put(`${API_ENDPOINTS.ADMINS}/${id}`, data);
    return response.data;
}
