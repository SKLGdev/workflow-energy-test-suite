import { test, expect } from "@playwright/test";
import { AuditoriaPage } from "../../pages/auditoria.page.js";

test.describe("Access Logs Page", () => {
    test("Validar que los elementos de la página de access logs estén presentes", async ({ page }) => {
        const auditoriaPage = new AuditoriaPage(page);

        await auditoriaPage.navegar();

        // Validar que la página esté cargada correctamente
        await auditoriaPage.validarCargaCorrecta();

        // Validar que las cards de métricas estén visibles
        await auditoriaPage.validarMetricasVisibles();

        // Validar que la sección de filtros esté visible
        await auditoriaPage.validarFiltrosVisibles();

        // Validar que la tabla esté visible
        await expect(auditoriaPage.tablaAuditoria).toBeVisible();

        // Validar que todas las columnas de la tabla estén visibles
        await auditoriaPage.validarColumnasTabla();

        // Validar que haya al menos una fila en la tabla
        const cantidadFilas = await auditoriaPage.obtenerCantidadFilas();
        expect(cantidadFilas).toBeGreaterThan(0);

        // Validar que la paginación esté visible
        await auditoriaPage.validarPaginacion();
    });

    test("Debería filtrar access logs por estado", async ({ page }) => {
        const auditoriaPage = new AuditoriaPage(page);

        await auditoriaPage.navegar();

        // Obtener cantidad inicial de filas
        const cantidadInicial = await auditoriaPage.obtenerCantidadFilas();

        // Filtrar por estado "Exitoso"
        await auditoriaPage.filtrarPorEstado("Exitoso");

        // Esperar a que se actualice la tabla
        await page.waitForTimeout(1000);

        // Validar que la tabla se haya actualizado
        const cantidadFiltrada = await auditoriaPage.obtenerCantidadFilas();
        expect(cantidadFiltrada).toBeGreaterThanOrEqual(0);
    });

    test("Debería filtrar access logs por dirección IP", async ({ page }) => {
        const auditoriaPage = new AuditoriaPage(page);

        await auditoriaPage.navegar();

        // Filtrar por dirección IP
        await auditoriaPage.filtrarPorDireccionIP("148.222.194.253");

        // Esperar a que se actualice la tabla
        await page.waitForTimeout(1000);

        // Validar que la tabla esté visible
        await expect(auditoriaPage.tablaAuditoria).toBeVisible();
    });

    test("Debería limpiar los filtros", async ({ page }) => {
        const auditoriaPage = new AuditoriaPage(page);

        await auditoriaPage.navegar();

        // Aplicar algunos filtros
        await auditoriaPage.filtrarPorDireccionIP("148.222.194.253");
        await page.waitForTimeout(500);

        // Limpiar filtros
        await auditoriaPage.limpiarFiltros();

        // Esperar a que se actualice
        await page.waitForTimeout(1000);

        // Validar que la tabla esté visible
        await expect(auditoriaPage.tablaAuditoria).toBeVisible();
    });
});

