/**
 * Centralized API Configuration
 * All API endpoints use this base URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
console.log("API Base URL:", API_BASE_URL);

export default API_BASE_URL;
