import { test } from "@playwright/test";
import { PaginaWorkOrders } from "../../pages/workOrders.page.js";

test.describe("Work Orders Page", () => {
    test("Verificar que los elementos de la página de órdenes estén visibles", async ({ page }) => {
        const workOrdersPage = new PaginaWorkOrders(page);

        await workOrdersPage.navegar();
        await workOrdersPage.validarCargaCorrecta();
        await workOrdersPage.validarEncabezadoSuperior("Ana Administradora");
        await workOrdersPage.validarMetricasVisibles();
        await workOrdersPage.validarFiltros();
        await workOrdersPage.validarColumnasTabla();
        await workOrdersPage.validarPaginacion();
    });
});
