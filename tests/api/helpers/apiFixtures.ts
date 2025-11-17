/**
 * Fixtures y datos de prueba para tests de API
 * Contiene datos reutilizables y helpers para crear datos de prueba
 */

import { test as base } from "@playwright/test";
import { ApiClient } from "./apiClient.js";
import { APIRequestContext } from "@playwright/test";
import { generarStringAleatorio, generarIdAleatorio } from "../../utils/helpers.js";
import { API_ENDPOINTS } from "./apiEndpoints.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";

// Emular __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lee el token de autenticación desde un storageState
 */
async function getTokenFromStorageState(storageStatePath: string): Promise<string | null> {
    try {
        const fullPath = path.join(__dirname, "..", "..", "e2e", "auth", storageStatePath);
        const content = await fs.readFile(fullPath, "utf-8");
        const storageState = JSON.parse(content);
        
        // Buscar el token en localStorage
        for (const origin of storageState.origins || []) {
            for (const item of origin.localStorage || []) {
                if (item.name === "accessToken") {
                    return item.value;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.warn(`No se pudo leer el token desde ${storageStatePath}:`, error);
        return null;
    }
}

// Extender el tipo de test para incluir nuestro fixture
type ApiFixtures = {
    apiClient: ApiClient;
    adminToken: string;
    supervisorToken: string;
    testData: {
        workOrder: {
            title: string;              // Cambiado de "titulo"
            description?: string;       // Cambiado de "descripcion"
            priority?: string;          // Cambiado de "prioridad"
            estimated_hours?: number;   // Cambiado de "horasEstimadas"
            location?: string;          // Cambiado de "ubicacion"
            team_id?: string | number;  // Cambiado de "idEquipo"
        };
        team: {
            name: string;
            description: string;
            plant_id?: number; // Opcional
            leader_id?: number | null; // Opcional
        };
    };
    // Fixtures con cleanup automático
    createdWorkOrder: { id: number | string; data: any };
    createdTeam: { id: number | string; data: any };
};

/**
 * Fixture base que proporciona ApiClient y tokens de autenticación
 */
export const test = base.extend<ApiFixtures>({
    // ApiClient disponible en todos los tests
    apiClient: async ({ request }, use) => {
        const apiClient = new ApiClient(request);
        await use(apiClient);
    },

    // Token de admin (se lee desde storageState)
    adminToken: async ({}, use) => {
        const token = await getTokenFromStorageState("adminAuth.json");
        
        if (!token) {
            throw new Error("No se pudo obtener el token de admin desde adminAuth.json. Asegúrate de ejecutar el globalSetup primero.");
        }

        await use(token);
    },

    // Token de supervisor (se lee desde storageState)
    supervisorToken: async ({}, use) => {
        const token = await getTokenFromStorageState("supervisorAuth.json");
        
        if (!token) {
            throw new Error("No se pudo obtener el token de supervisor desde supervisorAuth.json. Asegúrate de ejecutar el globalSetup primero.");
        }

        await use(token);
    },

    // Datos de prueba generados dinámicamente
    testData: async ({}, use) => {
        const data = {
            workOrder: {
                title: `Orden de Prueba ${generarStringAleatorio(8)}`,
                description: `Descripción de prueba generada automáticamente`,
                priority: "medium", // Valores comunes: low, medium, high
                estimated_hours: 4,
                location: `Ubicación ${generarStringAleatorio(10)}`,
                // team_id es opcional, no lo incluimos por defecto
            },
            team: {
                name: `Equipo ${generarStringAleatorio(8)}`,
                description: `Descripción del equipo de prueba`,
                // plant_id y leader_id son opcionales, no los incluimos por defecto
            },
        };

        await use(data);
    },

    // Fixture que crea un work order y lo limpia automáticamente después del test
    createdWorkOrder: async ({ apiClient, adminToken, testData }, use) => {
        // Crear el work order
        const createResponse = await apiClient.post(
            API_ENDPOINTS.WORK_ORDERS.BASE,
            testData.workOrder,
            { token: adminToken }
        );

        if (!createResponse.ok()) {
            throw new Error(`Failed to create work order: ${createResponse.status()}`);
        }

        const created = await createResponse.json();
        const workOrderData = created.workOrder || created;
        const workOrderId = workOrderData.id;

        // Proporcionar el work order al test
        await use({ id: workOrderId, data: workOrderData });

        // Cleanup: eliminar el work order después del test
        try {
            await apiClient.delete(API_ENDPOINTS.WORK_ORDERS.BY_ID(workOrderId), {
                token: adminToken,
            });
        } catch (error) {
            // Ignorar errores de cleanup (el recurso puede ya no existir)
            console.warn(`Failed to cleanup work order ${workOrderId}:`, error);
        }
    },

    // Fixture que crea un team y lo limpia automáticamente después del test
    createdTeam: async ({ apiClient, adminToken, testData }, use) => {
        // Crear el team
        const createResponse = await apiClient.post(
            API_ENDPOINTS.TEAMS.BASE,
            testData.team,
            { token: adminToken }
        );

        if (!createResponse.ok()) {
            throw new Error(`Failed to create team: ${createResponse.status()}`);
        }

        const created = await createResponse.json();
        const teamData = created.team || created;
        const teamId = teamData.id;

        // Proporcionar el team al test
        await use({ id: teamId, data: teamData });

        // Cleanup: eliminar el team después del test
        try {
            await apiClient.delete(API_ENDPOINTS.TEAMS.BY_ID(teamId), {
                token: adminToken,
            });
        } catch (error) {
            // Ignorar errores de cleanup (el recurso puede ya no existir)
            console.warn(`Failed to cleanup team ${teamId}:`, error);
        }
    },
});

export { expect } from "@playwright/test";

