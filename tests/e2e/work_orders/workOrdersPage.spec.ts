import { test } from "@playwright/test";
import { PaginaWorkOrders } from "../../pages/workOrders.page.js";

test.describe("Work Orders Page", () => {
    test.describe("Rol: admin", () => {
        test.use({ storageState: "tests/e2e/auth/adminAuth.json" });

        test("Verificar que los elementos de la página de órdenes estén visibles", async ({ page }) => {
            const workOrdersPage = new PaginaWorkOrders(page);

            await workOrdersPage.navegar();
            await workOrdersPage.validarCargaCorrecta("Gestión de Órdenes");
            await workOrdersPage.validarNavegacionLateral(true);
            await workOrdersPage.validarEncabezadoSuperior("Ana Administradora");
            await workOrdersPage.validarMetricasVisibles();
            await workOrdersPage.validarFiltros();
            await workOrdersPage.validarColumnasTabla(true);
            await workOrdersPage.validarPaginacion();
        });
    });

    test.describe("Rol: supervisor", () => {
        test.use({ storageState: "tests/e2e/auth/supervisorAuth.json" });

        test("Verificar que los elementos de la página de órdenes estén visibles", async ({ page }) => {
            const workOrdersPage = new PaginaWorkOrders(page);

            await workOrdersPage.navegar();
            await workOrdersPage.validarCargaCorrecta("Todas las Órdenes");
            await workOrdersPage.validarNavegacionLateral(true);
            await workOrdersPage.validarEncabezadoSuperior("Carlos Gerente");
            await workOrdersPage.validarMetricasVisibles();
            await workOrdersPage.validarFiltros();
            await workOrdersPage.validarColumnasTabla(true);
            await workOrdersPage.validarPaginacion();
        });
    });

    test.describe("Rol: jefe", () => {
        test.use({ storageState: "tests/e2e/auth/jefeAuth.json" });

        test("Verificar que los elementos de la página de órdenes estén visibles", async ({ page }) => {
            const workOrdersPage = new PaginaWorkOrders(page);

            await workOrdersPage.navegar();
            await workOrdersPage.validarCargaCorrecta("Órdenes del Equipo");
            await workOrdersPage.validarNavegacionLateral(false);
            await workOrdersPage.validarEncabezadoSuperior("María Líder");
            await workOrdersPage.validarMetricasVisibles();
            await workOrdersPage.validarFiltros();
            await workOrdersPage.validarColumnasTabla(true);
            await workOrdersPage.validarPaginacion();
        });
    });

    test.describe("Rol: empleado", () => {
        test.use({ storageState: "tests/e2e/auth/empleadoAuth.json" });

        test("Verificar que los elementos de la página de órdenes estén visibles", async ({ page }) => {
            const workOrdersPage = new PaginaWorkOrders(page);

            await workOrdersPage.navegar();
            await workOrdersPage.validarCargaCorrecta("Mis Órdenes de Trabajo");
            await workOrdersPage.validarNavegacionLateral(false);
            await workOrdersPage.validarEncabezadoSuperior("Juan Pérez");
            await workOrdersPage.validarMetricasVisibles();
            await workOrdersPage.validarFiltros();
            await workOrdersPage.validarColumnasTabla(false);
            await workOrdersPage.validarPaginacion();
        });
    });
});
