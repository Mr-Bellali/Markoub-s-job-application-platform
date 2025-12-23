export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',

    // Positions endpoint
    POSITIONS: '/positions',

    // Admins endpoint
    ADMINS: '/admins',

    // Candidtaes endpoint
    CANDIDATES: '/candidates',

    // Applications endpoints
    APPLICATIONS: '/applications',

} as const;

export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};
