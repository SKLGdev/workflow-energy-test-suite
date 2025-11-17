/**
 * Configuración centralizada de la API
 * Contiene todas las URLs base y configuraciones
 */

import dotenv from "dotenv";

dotenv.config();

export const API_CONFIG = {
    /**
     * URL base de la API
     * Se obtiene de la variable de entorno API_URL o usa un valor por defecto
     */
    BASE_URL: process.env.API_URL || process.env.VITE_API_URL || "https://workflow-energy.onrender.com/api",

    /**
     * Timeout por defecto para requests (en ms)
     */
    TIMEOUT: 30000,

    /**
     * Headers por defecto
     */
    DEFAULT_HEADERS: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
} as const;

/**
 * Obtiene la URL completa de un endpoint
 * @param endpoint - Endpoint relativo (ej: "/auth/login")
 * @returns URL completa
 */
export function getApiUrl(endpoint: string): string {
    const baseUrl = API_CONFIG.BASE_URL.endsWith("/") 
        ? API_CONFIG.BASE_URL.slice(0, -1) 
        : API_CONFIG.BASE_URL;
    
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
}

