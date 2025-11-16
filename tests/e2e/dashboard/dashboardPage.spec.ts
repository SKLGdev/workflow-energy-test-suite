import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboard.page.js";

test.describe("Dashboard Page", () => {
    test("Validar que el dashboard cargue correctamente", async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        await dashboardPage.navegar();
        await dashboardPage.validarBienvenida("Bienvenido, Ana Administradora");
        await dashboardPage.validarEncabezadoSuperior("Ana Administradora");

        for (const elemento of dashboardPage.getDatosMetricas()) {
            await expect(elemento).toBeVisible();
        }

        for (const elemento of dashboardPage.getGraficos()) {
            await expect(elemento).toBeVisible();
        }
    });
});
