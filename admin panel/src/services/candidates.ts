import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';

// Service to get paginated candidates
export async function getPaginatedCandidates(
    page = 1,
    limit = 10
) {
    const response = await api.get(API_ENDPOINTS.CANDIDATES, {
        params: { page, limit }
    });
    return response.data;
}

// Service to get candidate by ID
export async function getCandidateById(id: number) {
    const response = await api.get(`${API_ENDPOINTS.CANDIDATES}/${id}`);
    return response.data;
}