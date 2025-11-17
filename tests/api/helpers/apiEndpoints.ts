/**
 * Centralización de todos los endpoints de la API
 * Facilita el mantenimiento y evita errores de tipeo
 */

export const API_ENDPOINTS = {
    // ====== Autenticación ======
    AUTH: {
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        PROFILE: "/auth/me", // Endpoint común para obtener perfil del usuario autenticado
    },

    // ====== Work Orders ======
    WORK_ORDERS: {
        BASE: "/work-orders",
        BY_ID: (id: string | number) => `/work-orders/${id}`,
        UPDATE: (id: string | number) => `/work-orders/${id}`,
        DELETE: (id: string | number) => `/work-orders/${id}`,
        BY_STATUS: (status: string) => `/work-orders?status=${status}`,
        BY_PRIORITY: (priority: string) => `/work-orders?priority=${priority}`,
    },

    // ====== Teams ======
    TEAMS: {
        BASE: "/teams",
        BY_ID: (id: string | number) => `/teams/${id}`,
        UPDATE: (id: string | number) => `/teams/${id}`,
        DELETE: (id: string | number) => `/teams/${id}`,
        MEMBERS: (id: string | number) => `/teams/${id}/members`,
    },

    // ====== Dashboard ======
    DASHBOARD: {
        STATS: "/dashboard/stats",
        METRICS: "/dashboard/metrics",
        TRENDS: "/dashboard/trends",
    },

    // ====== Access Logs / Auditoría ======
    ACCESS_LOGS: {
        BASE: "/access-logs",
        BY_USER: (userId: string | number) => `/access-logs?user_id=${userId}`,
        BY_DATE: (from: string, to: string) => `/access-logs?from=${from}&to=${to}`,
    },

    // ====== Users ======
    USERS: {
        BASE: "/users",
        BY_ID: (id: string | number) => `/users/${id}`,
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
    },
} as const;

