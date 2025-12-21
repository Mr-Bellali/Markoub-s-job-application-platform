import { API_ENDPOINTS } from '../constants/endpoints';
import { api } from './api';

// Service to get paginated positions
export async function getPaginatedPositions  (
    page = 1,
    limit = 10,
    filter = ""
) {
    const response = await api.get(API_ENDPOINTS.POSITIONS, {
        params: { page, limit, category: filter || undefined }
    });
    return response.data;
}

// Service to get position by ID

// Service to create a position
export async function createPosition(data: {
    title: string;
    category: string;
    workType: string;
    location?: string;
    description: string;
}) {
    const response = await api.post(API_ENDPOINTS.POSITIONS, data);
    return response.data;
}