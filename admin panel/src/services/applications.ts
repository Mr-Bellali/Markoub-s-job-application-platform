import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';

// Service to get paginated applications
export async function getPaginatedApplications(
    page = 1,
    limit = 10
) {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS, {
        params: { page, limit }
    });
    return response.data;
}

// Service to get application by ID
export async function getApplicationById(id: number) {
    const response = await api.get(`${API_ENDPOINTS.APPLICATIONS}/${id}`);
    return response.data;
}