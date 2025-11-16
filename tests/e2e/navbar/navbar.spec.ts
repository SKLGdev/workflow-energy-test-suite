import { test, expect } from "@playwright/test";
import { NavbarPage } from "../../pages/navbar.page.js";
import { DashboardPage } from "../../pages/dashboard.page.js";

test.describe("Navbar", () => {
    test("Validar que el navbar esté visible y tenga todos los elementos", async ({ page }) => {
        const navbarPage = new NavbarPage(page);
        const dashboardPage = new DashboardPage(page);

        // Navegar a una página que tenga el navbar
        await dashboardPage.navegar();

        // Validar que el navbar esté visible
        await navbarPage.validarNavbarVisible();

        // Validar que el título del navbar esté visible
        await navbarPage.validarTituloNavbar();

        // Validar que todos los elementos del menú estén visibles
        await navbarPage.validarElementosMenu();
    });

    test("Validar que se puede navegar a cada sección desde el navbar", async ({ page }) => {
        const navbarPage = new NavbarPage(page);
        const dashboardPage = new DashboardPage(page);

        // Empezar en el dashboard
        await dashboardPage.navegar();
        await expect(page).toHaveURL(/\/dashboard/);

        // Navegar a Órdenes
        await navbarPage.navegarA("Órdenes");
        await expect(page).toHaveURL(/\/work-orders/);
        await navbarPage.validarMenuSeleccionado("Órdenes");

        // Navegar a Dashboard
        await navbarPage.navegarA("Dashboard");
        await expect(page).toHaveURL(/\/dashboard/);
        await navbarPage.validarMenuSeleccionado("Dashboard");

        // Navegar a Equipos
        await navbarPage.navegarA("Equipos");
        await expect(page).toHaveURL(/\/teams/);

        // Navegar a Auditoría
        await navbarPage.navegarA("Auditoría");
        await expect(page).toHaveURL(/\/access-logs/);
    });

    test("Validar que los elementos del menú son clickeables", async ({ page }) => {
        const navbarPage = new NavbarPage(page);
        const dashboardPage = new DashboardPage(page);

        await dashboardPage.navegar();

        // Verificar que todos los elementos del menú son botones clickeables
        for (const elemento of navbarPage.getElementosMenu()) {
            await expect(elemento).toBeVisible();
            await expect(elemento).toBeEnabled();
        }
    });
});

