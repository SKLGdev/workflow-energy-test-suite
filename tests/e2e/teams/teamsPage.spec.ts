import { test, expect } from "@playwright/test";
import { TeamsPage } from "../../pages/teams.page.js";

test.describe("Teams Page", () => {
    test("Validar que los elementos de la página de equipos estén presentes", async ({ page }) => {
        const teamsPage = new TeamsPage(page);

        await teamsPage.navegar();

        // Validar que la página esté cargada correctamente
        await teamsPage.validarCargaCorrecta();

        // Validar que haya equipos en la página
        await teamsPage.validarEquiposPresentes();

        // Validar que al menos una card tenga todos los elementos esperados
        const cantidadEquipos = await teamsPage.obtenerCantidadEquipos();
        expect(cantidadEquipos).toBeGreaterThan(0);

        // Obtener el primer equipo y validar su estructura
        const primerCard = teamsPage.cardsEquipos.first();
        await expect(primerCard).toBeVisible();
        await expect(teamsPage.getTituloCard(primerCard)).toBeVisible();
        await expect(teamsPage.getBotonVerDetalles(primerCard)).toBeVisible();
        await expect(teamsPage.getBotonEditar(primerCard)).toBeVisible();
        await expect(teamsPage.getBotonEliminar(primerCard)).toBeVisible();
    });
});

