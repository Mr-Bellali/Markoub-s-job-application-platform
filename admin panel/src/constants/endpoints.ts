export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  
  // Add more endpoints as needed
  // POSITIONS: '/positions',
  // CANDIDATES: '/candidates',
  // APPLICATIONS: '/applications',
  // ADMINS: '/admins',
} as const;

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};
