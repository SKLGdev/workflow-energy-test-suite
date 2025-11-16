import { test, expect } from "@playwright/test";
import { AuditoriaPage } from "../../pages/auditoria.page.js";

test.describe("Auditoría Page", () => {
    test("Validar que los elementos de la página de auditoría estén presentes", async ({ page }) => {
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
});

