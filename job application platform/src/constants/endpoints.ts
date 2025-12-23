export const API_ENDPOINTS = {
    POSITIONS: "/positions",
} as const;

export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};
