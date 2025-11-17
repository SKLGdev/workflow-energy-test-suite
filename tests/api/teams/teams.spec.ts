/**
 * Tests de API para Teams
 */

import { test, expect } from "../helpers/apiFixtures.js";
import { API_ENDPOINTS } from "../helpers/apiEndpoints.js";
import { expectStatus, expectSuccess, expectListResponse, expectObjectResponse } from "../helpers/responseValidators.js";

test.describe("API - Teams", () => {
    test.describe("GET /teams", () => {
        test("Debería obtener la lista de equipos", async ({ apiClient, adminToken }) => {
            const response = await apiClient.get(API_ENDPOINTS.TEAMS.BASE, {
                token: adminToken,
            });

            await expectSuccess(response);
            await expectListResponse(response);
        });

        test("No debería obtener equipos sin autenticación", async ({ apiClient }) => {
            const response = await apiClient.get(API_ENDPOINTS.TEAMS.BASE);

            await expectStatus(response, 401);
        });
    });

    test.describe("POST /teams", () => {
        test("Debería crear un equipo exitosamente", async ({ apiClient, adminToken, testData }) => {
            const response = await apiClient.post(
                API_ENDPOINTS.TEAMS.BASE,
                testData.team,
                { token: adminToken }
            );

            await expectStatus(response, 201);
            
            // La respuesta tiene la estructura { message: "...", team: { id, name, ... } }
            const data = await response.json();
            expect(data).toHaveProperty("team");
            expect(data.team).toHaveProperty("id");
            expect(data.team).toHaveProperty("name");
        });

        test("No debería crear equipo sin nombre (campo requerido)", async ({ apiClient, adminToken, testData }) => {
            const teamSinNombre = { ...testData.team, name: "" };

            const response = await apiClient.post(
                API_ENDPOINTS.TEAMS.BASE,
                teamSinNombre,
                { token: adminToken }
            );

            await expectStatus(response, 400);
        });
    });
});

