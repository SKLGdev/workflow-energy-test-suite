import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboard.page.js";

test.describe("Dashboard Page", () => {
    test.describe("Rol: admin", () => {
        test.use({ storageState: "tests/e2e/auth/adminAuth.json" });

        test("Validar que el dashboard cargue correctamente", async ({ page }) => {
            const dashboardPage = new DashboardPage(page);

            await dashboardPage.navegar();
            await dashboardPage.validarBienvenida("Bienvenido, Ana Administradora");
            await dashboardPage.validarEncabezadoSuperior("Ana Administradora");
            await dashboardPage.validarNavegacionLateral(true);

            for (const elemento of dashboardPage.getDatosMetricas()) {
                await expect(elemento).toBeVisible();
            }

            for (const elemento of dashboardPage.getGraficos()) {
                await expect(elemento).toBeVisible();
            }
        });
    });

    test.describe("Rol: supervisor", () => {
        test.use({ storageState: "tests/e2e/auth/supervisorAuth.json" });

        test("Validar que el dashboard cargue correctamente", async ({ page }) => {
            const dashboardPage = new DashboardPage(page);

            await dashboardPage.navegar();
            await dashboardPage.validarBienvenida("Bienvenido, Carlos Gerente");
            await dashboardPage.validarEncabezadoSuperior("Carlos Gerente");
            await dashboardPage.validarNavegacionLateral(true);

            for (const elemento of dashboardPage.getDatosMetricas()) {
                await expect(elemento).toBeVisible();
            }

            for (const elemento of dashboardPage.getGraficos()) {
                await expect(elemento).toBeVisible();
            }
        });
    });

    test.describe("Rol: jefe", () => {
        test.use({ storageState: "tests/e2e/auth/jefeAuth.json" });

        test("Validar que el dashboard cargue correctamente", async ({ page }) => {
            const dashboardPage = new DashboardPage(page);

            await dashboardPage.navegar();
            await dashboardPage.validarBienvenida("Bienvenido, María Líder");
            await dashboardPage.validarEncabezadoSuperior("María Líder");
            await dashboardPage.validarNavegacionLateral(false);

            for (const elemento of dashboardPage.getDatosMetricas()) {
                await expect(elemento).toBeVisible();
            }

            for (const elemento of dashboardPage.getGraficos()) {
                await expect(elemento).toBeVisible();
            }
        });
    });

    test.describe("Rol: empleado", () => {
        test.use({ storageState: "tests/e2e/auth/empleadoAuth.json" });

        test("Validar que el dashboard cargue correctamente", async ({ page }) => {
            const dashboardPage = new DashboardPage(page);

            await dashboardPage.navegar();
            await dashboardPage.validarBienvenida("Bienvenido, Juan Pérez");
            await dashboardPage.validarEncabezadoSuperior("Juan Pérez");
            await dashboardPage.validarNavegacionLateral(false);

            for (const elemento of dashboardPage.getDatosMetricas()) {
                await expect(elemento).toBeVisible();
            }

            for (const elemento of dashboardPage.getGraficos()) {
                await expect(elemento).toBeVisible();
            }
        });
    });
});
