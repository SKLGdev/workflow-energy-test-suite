import { test, expect } from "@playwright/test";
import { TeamsPage } from "../../pages/teams.page.js";

test.describe("Crear Equipo", () => {
    test("Debería crear un equipo exitosamente", async ({ page }) => {
        const teamsPage = new TeamsPage(page);

        await teamsPage.navegar();

        // Obtener la cantidad inicial de equipos
        const cantidadInicial = await teamsPage.obtenerCantidadEquipos();

        // Esperar la respuesta de la API antes de crear el equipo
        const responsePromise = page.waitForResponse(
            (response) =>
                (response.url().includes("/teams") || response.url().includes("/team")) &&
                response.request().method() === "POST"
        );

        // Crear el equipo
        await teamsPage.crearEquipo({
            nombre: `Equipo de Prueba E2E ${Date.now()}`,
            descripcion: "Este es un equipo creado mediante pruebas automatizadas",
            idPlanta: 0,
        });

        // Esperar y validar la respuesta de la API
        const response = await responsePromise;
        expect(response.status()).toBe(201); // Created

        // Validar que el modal se haya cerrado
        await expect(teamsPage.modalCrearEquipo).not.toBeVisible({ timeout: 5000 });

        // Esperar a que la página termine de cargar y el grid de equipos esté visible
        await expect(teamsPage.gridEquipos).toBeVisible({ timeout: 10000 });
        await expect(teamsPage.tituloPagina).toBeVisible();

        // Validar que la cantidad de equipos haya aumentado
        const cantidadFinal = await teamsPage.obtenerCantidadEquipos();
        expect(cantidadFinal).toBeGreaterThan(cantidadInicial);
    });

    test("Debería validar que el campo Nombre del Equipo sea requerido", async ({ page }) => {
        const teamsPage = new TeamsPage(page);

        await teamsPage.navegar();

        // Abrir el modal
        await teamsPage.clickCrearEquipo();
        await teamsPage.validarModalCrearEquipoVisible();

        // Validar que el campo sea requerido
        await teamsPage.validarNombreEquipoRequerido();

        // Intentar crear sin completar el nombre (debería fallar la validación HTML5)
        await teamsPage.botonCrear.click();

        // El modal debería seguir visible porque la validación HTML5 previene el envío
        await expect(teamsPage.modalCrearEquipo).toBeVisible();
    });
});

