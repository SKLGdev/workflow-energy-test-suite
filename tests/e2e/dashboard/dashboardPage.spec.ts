import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboard.page.js";

test.describe("Dashboard Page", () => {
    const roles = [
        { rol: "admin", authFile: "adminAuth.json", expectedName: "Ana Administradora" },
        { rol: "supervisor", authFile: "supervisorAuth.json", expectedName: "Carlos Gerente" },
        { rol: "jefe", authFile: "jefeAuth.json", expectedName: "María Líder" },
        { rol: "empleado", authFile: "empleadoAuth.json", expectedName: "Juan Pérez" },
    ];

    for (const { rol, authFile, expectedName } of roles) {
        test.describe(`Rol ${rol}`, () => {
            test.use({ storageState: `tests/e2e/auth/${authFile}` });

            test(`Validar que el dashboard cargue correctamente para el rol ${rol}`, async ({ page }) => {
                const dashboardPage = new DashboardPage(page);

                await dashboardPage.navegar();
                await expect(dashboardPage.welcomeMessage).toContainText(`Bienvenido, ${expectedName}`);
            });
        });
    }

    test.describe("Validación general del dashboard", () => {
        test.use({ storageState: "tests/e2e/auth/adminAuth.json" });

        test("Validar que el dashboard cargue correctamente", async ({ page }) => {
            const dashboardPage = new DashboardPage(page);

            await dashboardPage.navegar();
            await dashboardPage.validarBienvenida("Bienvenido, Ana Administradora");

            for (const elemento of dashboardPage.getDatosMetricas()) {
                await expect(elemento).toBeVisible();
            }

            for (const elemento of dashboardPage.getGraficos()) {
                await expect(elemento).toBeVisible();
            }
        });
    });
});
