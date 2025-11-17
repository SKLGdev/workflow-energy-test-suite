/**
 * Helpers para validar respuestas de API
 * Proporciona funciones reutilizables para validar estructuras de respuesta
 */

import { APIResponse } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Valida que una respuesta tenga un status code específico
 */
export async function expectStatus(response: APIResponse, status: number) {
    expect(response.status()).toBe(status);
}

/**
 * Valida que una respuesta sea exitosa (2xx)
 */
export async function expectSuccess(response: APIResponse) {
    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
}

/**
 * Valida que una respuesta tenga un error (4xx o 5xx)
 */
export async function expectError(response: APIResponse) {
    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(400);
}

/**
 * Valida que una respuesta tenga un formato JSON válido
 */
export async function expectJson(response: APIResponse) {
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
}

/**
 * Valida que una respuesta tenga una propiedad específica
 */
export async function expectProperty(response: APIResponse, property: string) {
    const data = await response.json();
    expect(data).toHaveProperty(property);
}

/**
 * Valida que una respuesta tenga un mensaje de error
 */
export async function expectErrorMessage(response: APIResponse, message?: string) {
    const data = await response.json();
    expect(data).toHaveProperty("message");
    
    if (message) {
        expect(data.message).toContain(message);
    }
}

/**
 * Valida la estructura básica de una respuesta de lista
 * Acepta diferentes estructuras comunes:
 * - Array directo: []
 * - Objeto con propiedad data: { data: [] }
 * - Objeto con propiedad items: { items: [] }
 * - Objeto con propiedad results: { results: [] }
 * - Objeto con propiedad teams: { teams: [] }
 */
export async function expectListResponse(response: APIResponse) {
    await expectSuccess(response);
    await expectJson(response);
    
    const data = await response.json();
    
    // Verificar si es un array directo
    if (Array.isArray(data)) {
        return;
    }
    
    // Verificar estructuras comunes de respuesta de lista
    const isListStructure = 
        Array.isArray(data.data) ||
        Array.isArray(data.items) ||
        Array.isArray(data.results) ||
        Array.isArray(data.teams) ||
        Array.isArray(data.users) ||
        Array.isArray(data.workOrders);
    
    expect(isListStructure).toBeTruthy();
}

/**
 * Valida la estructura básica de una respuesta de objeto único
 */
export async function expectObjectResponse(response: APIResponse, requiredFields?: string[]) {
    await expectSuccess(response);
    await expectJson(response);
    
    const data = await response.json();
    expect(typeof data).toBe("object");
    expect(data).not.toBeNull();
    
    if (requiredFields) {
        for (const field of requiredFields) {
            expect(data).toHaveProperty(field);
        }
    }
}

/**
 * Valida que una respuesta tenga paginación
 */
export async function expectPagination(response: APIResponse) {
    const data = await response.json();
    expect(data).toHaveProperty("page");
    expect(data).toHaveProperty("limit");
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("data");
}

