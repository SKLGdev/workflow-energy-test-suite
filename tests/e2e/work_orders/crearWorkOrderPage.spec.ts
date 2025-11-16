import { test, expect } from "@playwright/test";
import { CrearWorkOrderPage } from "../../pages/crearWorkOrder.page.js";

test.describe("Página deCrear Work Order", () => {
    test("Validar que los elementos de la página de crear orden estén presentes", async ({ page }) => {
        const crearWorkOrderPage = new CrearWorkOrderPage(page);

        await crearWorkOrderPage.navegar();

        // Validar que el formulario esté visible
        await crearWorkOrderPage.validarFormularioVisible();

        // Validar que todos los campos estén visibles
        await crearWorkOrderPage.validarCamposVisibles();

        // Validar que los botones de acción estén visibles
        await crearWorkOrderPage.validarBotonesAccion();

        // Validar que el campo Título sea requerido
        await crearWorkOrderPage.validarTituloRequerido();
    });
});
