import { test, expect } from "@playwright/test";
import { CrearWorkOrderPage } from "../../pages/crearWorkOrder.page.js";
import { generarStringAleatorio, generarIdAleatorio } from "../../utils/helpers.js";

test.describe("Crear Work Order", () => {
    test("Debería crear una orden de trabajo exitosamente", async ({ page }) => {
        const crearWorkOrderPage = new CrearWorkOrderPage(page);

        await crearWorkOrderPage.navegar();

        // Esperar la respuesta de la API antes de crear la orden
        const responsePromise = page.waitForResponse(
            (response) =>
                (response.url().includes("/work-orders") || response.url().includes("/orders")) &&
                response.request().method() === "POST"
        );

        // Completar el formulario con datos de prueba
        await crearWorkOrderPage.completarFormulario({
            titulo: `Orden de prueba E2E ${generarStringAleatorio(8)}`,
            descripcion: `Esta es una orden de trabajo creada mediante pruebas automatizadas ${generarStringAleatorio(6)}`,
            prioridad: "Media",
            horasEstimadas: 4,
            ubicacion: `Av. Corrientes ${generarIdAleatorio(4)}, CABA`,
            idEquipo: `EQ-${generarIdAleatorio(3)}`,
        });

        // Crear la orden
        await crearWorkOrderPage.crearOrden();

        // Esperar y validar la respuesta de la API
        const response = await responsePromise;
        expect(response.status()).toBe(201); // Created

        // Validar que aparece el mensaje de éxito
        await crearWorkOrderPage.validarMensajeExito();

        // Validar que se redirige a la página de órdenes
        await expect(page).toHaveURL(/\/work-orders/);
    });
});
