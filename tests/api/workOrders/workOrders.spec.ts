/**
 * Tests de API para Work Orders
 */

import { test, expect } from "../helpers/apiFixtures.js";
import { API_ENDPOINTS } from "../helpers/apiEndpoints.js";
import { expectStatus, expectSuccess, expectListResponse, expectObjectResponse } from "../helpers/responseValidators.js";

test.describe("API - Work Orders", () => {
    test.describe("GET /work-orders", () => {
        test("Debería obtener la lista de work orders", async ({ apiClient, adminToken }) => {
            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE, {
                token: adminToken,
            });

            await expectSuccess(response);
            await expectListResponse(response);
        });

        test("Debería filtrar work orders por estado", async ({ apiClient, adminToken }) => {
            // Primero obtener la lista sin filtro para ver qué estados existen
            const allResponse = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE, {
                token: adminToken,
            });
            
            if (!allResponse.ok()) {
                throw new Error(`No se pudo obtener la lista de work orders: ${allResponse.status()}`);
            }

            const allData = await allResponse.json();
            const workOrders = Array.isArray(allData) ? allData : (allData.data || allData.workOrders || []);
            
            // Buscar un estado válido de los work orders existentes
            let validStatus: string | undefined;
            if (workOrders.length > 0) {
                validStatus = workOrders[0].status || workOrders[0].estado;
            }

            // Si no encontramos un estado válido, usar valores comunes en inglés
            const statusToUse = validStatus || "pending";

            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE, {
                token: adminToken,
                params: { status: statusToUse },
            });

            await expectSuccess(response);
            await expectListResponse(response);
        });

        test("Debería filtrar work orders por prioridad", async ({ apiClient, adminToken }) => {
            // Primero obtener la lista sin filtro para ver qué prioridades existen
            const allResponse = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE, {
                token: adminToken,
            });
            
            if (!allResponse.ok()) {
                throw new Error(`No se pudo obtener la lista de work orders: ${allResponse.status()}`);
            }

            const allData = await allResponse.json();
            const workOrders = Array.isArray(allData) ? allData : (allData.data || allData.workOrders || []);
            
            // Buscar una prioridad válida de los work orders existentes
            let validPriority: string | undefined;
            if (workOrders.length > 0) {
                validPriority = workOrders[0].priority || workOrders[0].prioridad;
            }

            // Si no encontramos una prioridad válida, usar valores comunes
            const priorityToUse = validPriority || "high";

            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE, {
                token: adminToken,
                params: { priority: priorityToUse },
            });

            await expectSuccess(response);
            await expectListResponse(response);
        });

        test("No debería obtener work orders sin autenticación", async ({ apiClient }) => {
            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BASE);

            await expectStatus(response, 401);
        });
    });

    test.describe("POST /work-orders", () => {
        test("Debería crear un work order exitosamente", async ({ apiClient, adminToken, testData }) => {
            const response = await apiClient.post(
                API_ENDPOINTS.WORK_ORDERS.BASE,
                testData.workOrder,
                { token: adminToken }
            );

            // Si falla, mostrar el mensaje de error para debugging
            if (!response.ok()) {
                const errorData = await response.json();
                console.error("Error al crear work order:", errorData);
            }

            await expectStatus(response, 201);
            
            // La respuesta tiene la estructura { message: "...", workOrder: { id, title, ... } }
            const data = await response.json();
            expect(data).toHaveProperty("workOrder");
            // Verificar si tiene workOrder wrapper o está directamente
            const workOrder = data.workOrder || data;
            expect(workOrder).toHaveProperty("id");
            expect(workOrder).toHaveProperty("title");
        });

        test("No debería crear work order sin título (campo requerido)", async ({ apiClient, adminToken, testData }) => {
            const workOrderSinTitulo = { ...testData.workOrder, title: "" };

            const response = await apiClient.post(
                API_ENDPOINTS.WORK_ORDERS.BASE,
                workOrderSinTitulo,
                { token: adminToken }
            );

            await expectStatus(response, 400);
        });

        test("No debería crear work order sin autenticación", async ({ apiClient, testData }) => {
            const response = await apiClient.post(
                API_ENDPOINTS.WORK_ORDERS.BASE,
                testData.workOrder
            );

            await expectStatus(response, 401);
        });
    });

    test.describe("GET /work-orders/:id", () => {
        test("Debería obtener un work order por ID", async ({ apiClient, adminToken }) => {
            // Primero crear un work order para obtener su ID
            const createResponse = await apiClient.post(
                API_ENDPOINTS.WORK_ORDERS.BASE,
                {
                    title: `Test Order ${Date.now()}`,
                    description: "Test description",
                    priority: "medium",
                },
                { token: adminToken }
            );

            const created = await createResponse.json();
            // La respuesta puede tener workOrder wrapper
            const workOrderData = created.workOrder || created;
            const workOrderId = workOrderData.id;

            // Luego obtenerlo por ID
            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BY_ID(workOrderId), {
                token: adminToken,
            });

            await expectSuccess(response);
            
            // La respuesta puede tener diferentes estructuras
            const data = await response.json();
            const workOrder = data.workOrder || data;
            expect(workOrder).toHaveProperty("id");
            expect(workOrder).toHaveProperty("title");
        });

        test("No debería obtener work order con ID inexistente", async ({ apiClient, adminToken }) => {
            const response = await apiClient.get(API_ENDPOINTS.WORK_ORDERS.BY_ID(99999), {
                token: adminToken,
            });

            await expectStatus(response, 404);
        });
    });
});

