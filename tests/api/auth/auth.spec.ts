/**
 * Tests de API para autenticación
 */

import { test, expect } from "../helpers/apiFixtures.js";
import { API_ENDPOINTS } from "../helpers/apiEndpoints.js";
import { expectStatus, expectSuccess, expectErrorMessage } from "../helpers/responseValidators.js";

test.describe("API - Autenticación", () => {
    test.describe("POST /auth/login", () => {
        test("Debería hacer login exitosamente con credenciales válidas", async ({ apiClient }) => {
            const email = process.env.ADMIN_USER || "";
            const password = process.env.ADMIN_PASS || "";

            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
            });

            await expectSuccess(response);
            await expectStatus(response, 200);

            const data = await response.json();
            expect(data).toHaveProperty("accessToken");
            expect(data.accessToken).toBeTruthy();
        });

        test("No debería hacer login con credenciales incorrectas", async ({ apiClient }) => {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                email: "usuario@noexiste.com",
                password: "passwordIncorrecta",
            });

            await expectStatus(response, 401);
            await expectErrorMessage(response);
        });

        test("No debería hacer login con email inválido", async ({ apiClient }) => {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                email: "emailInvalido",
                password: "12345678",
            });

            await expectStatus(response, 400);
        });

        test("No debería hacer login con campos vacíos", async ({ apiClient }) => {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                email: "",
                password: "",
            });

            await expectStatus(response, 400);
        });
    });

    test.describe("GET /auth/profile", () => {
        test("Debería obtener el perfil del usuario autenticado", async ({ apiClient, adminToken }) => {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
                token: adminToken,
            });

            // Verificar primero el status code antes de validar éxito
            await expectStatus(response, 200);
            await expectSuccess(response);

            const data = await response.json();
            expect(data).toHaveProperty("user");
            expect(data.user).toHaveProperty("email");
            expect(data.user).toHaveProperty("role");
        });

        test("No debería obtener el perfil sin token", async ({ apiClient }) => {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

            await expectStatus(response, 401);
        });

        test("No debería obtener el perfil con token inválido", async ({ apiClient }) => {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
                token: "tokenInvalido123",
            });

            // La API puede devolver 401 (Unauthorized) o 403 (Forbidden) para tokens inválidos
            const status = response.status();
            expect([401, 403]).toContain(status);
        });
    });
});

