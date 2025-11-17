/**
 * Cliente API helper para simplificar requests
 * Proporciona métodos reutilizables para hacer peticiones HTTP
 */

import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_CONFIG, getApiUrl } from "./apiConfig.js";
import { API_ENDPOINTS } from "./apiEndpoints.js";

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    /**
     * Obtiene el token de autenticación desde el storage state
     */
    private async getAuthToken(): Promise<string | null> {
        // El token se obtiene del storageState configurado en playwright.config.ts
        // O se puede pasar explícitamente en los métodos
        return null;
    }

    /**
     * Crea headers con autenticación
     */
    private async getAuthHeaders(token?: string): Promise<Record<string, string>> {
        const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
        
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        return headers;
    }

    /**
     * Realiza una petición GET
     */
    async get(
        endpoint: string,
        options?: {
            token?: string;
            params?: Record<string, string | number>;
            headers?: Record<string, string>;
        }
    ): Promise<APIResponse> {
        const url = getApiUrl(endpoint);
        const headers = await this.getAuthHeaders(options?.token);
        
        return await this.request.get(url, {
            headers: { ...headers, ...options?.headers },
            params: options?.params,
            timeout: API_CONFIG.TIMEOUT,
        });
    }

    /**
     * Realiza una petición POST
     */
    async post(
        endpoint: string,
        data?: unknown,
        options?: {
            token?: string;
            headers?: Record<string, string>;
        }
    ): Promise<APIResponse> {
        const url = getApiUrl(endpoint);
        const headers = await this.getAuthHeaders(options?.token);

        return await this.request.post(url, {
            headers: { ...headers, ...options?.headers },
            data: data as any,
            timeout: API_CONFIG.TIMEOUT,
        });
    }

    /**
     * Realiza una petición PUT
     */
    async put(
        endpoint: string,
        data?: unknown,
        options?: {
            token?: string;
            headers?: Record<string, string>;
        }
    ): Promise<APIResponse> {
        const url = getApiUrl(endpoint);
        const headers = await this.getAuthHeaders(options?.token);

        return await this.request.put(url, {
            headers: { ...headers, ...options?.headers },
            data: data as any,
            timeout: API_CONFIG.TIMEOUT,
        });
    }

    /**
     * Realiza una petición PATCH
     */
    async patch(
        endpoint: string,
        data?: unknown,
        options?: {
            token?: string;
            headers?: Record<string, string>;
        }
    ): Promise<APIResponse> {
        const url = getApiUrl(endpoint);
        const headers = await this.getAuthHeaders(options?.token);

        return await this.request.patch(url, {
            headers: { ...headers, ...options?.headers },
            data: data as any,
            timeout: API_CONFIG.TIMEOUT,
        });
    }

    /**
     * Realiza una petición DELETE
     */
    async delete(
        endpoint: string,
        options?: {
            token?: string;
            headers?: Record<string, string>;
        }
    ): Promise<APIResponse> {
        const url = getApiUrl(endpoint);
        const headers = await this.getAuthHeaders(options?.token);

        return await this.request.delete(url, {
            headers: { ...headers, ...options?.headers },
            timeout: API_CONFIG.TIMEOUT,
        });
    }

    // ====== Métodos específicos de dominio ======

    /**
     * Login y obtiene el token
     */
    async login(email: string, password: string): Promise<{ token: string; user: unknown }> {
        const response = await this.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });

        if (!response.ok()) {
            throw new Error(`Login failed: ${response.status()} ${response.statusText()}`);
        }

        const data = await response.json();
        return {
            token: data.accessToken || data.token,
            user: data.user || data,
        };
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    async getProfile(token: string): Promise<unknown> {
        const response = await this.get(API_ENDPOINTS.AUTH.PROFILE, { token });
        
        if (!response.ok()) {
            throw new Error(`Get profile failed: ${response.status()}`);
        }

        return await response.json();
    }
}

