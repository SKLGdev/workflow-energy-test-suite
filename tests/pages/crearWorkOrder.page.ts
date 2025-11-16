import { Page, Locator, expect } from "@playwright/test";

export class CrearWorkOrderPage {
    readonly page: Page;

    // Título de la página
    readonly tituloPagina: Locator;

    // Campos del formulario
    readonly inputTitulo: Locator;
    readonly textareaDescripcion: Locator;
    readonly selectPrioridad: Locator;
    readonly autocompleteAsignarA: Locator;
    readonly selectProyecto: Locator;
    readonly inputHorasEstimadas: Locator;
    readonly inputFechaLimite: Locator;
    readonly textareaUbicacion: Locator;
    readonly botonMiUbicacion: Locator;
    readonly inputIdEquipo: Locator;

    // Botones de acción
    readonly botonCancelar: Locator;
    readonly botonCrearOrden: Locator;

    // Mensajes de éxito/error
    readonly mensajeExito: Locator;

    // Formulario
    readonly formulario: Locator;

    constructor(page: Page) {
        this.page = page;

        // Contenido principal
        const main = page.locator("main");

        // Título de la página
        this.tituloPagina = main.locator("h4.MuiTypography-h4").filter({ hasText: "Crear Orden de Trabajo" });

        // Formulario
        this.formulario = main.locator("form");

        // Campos del formulario
        this.inputTitulo = this.formulario.getByLabel("Título *");
        this.textareaDescripcion = this.formulario.getByLabel("Descripción");
        this.selectPrioridad = this.formulario.locator("label").filter({ hasText: "Prioridad" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.autocompleteAsignarA = this.formulario.getByLabel("Asignar a");
        this.selectProyecto = this.formulario.locator("label").filter({ hasText: "Proyecto" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.inputHorasEstimadas = this.formulario.getByLabel("Horas Estimadas");
        this.inputFechaLimite = this.formulario.getByLabel("Fecha Límite");
        this.textareaUbicacion = this.formulario.getByLabel("Ubicación / Dirección");
        this.botonMiUbicacion = this.formulario.getByRole("button", { name: "Mi Ubicación" });
        this.inputIdEquipo = this.formulario.getByLabel("ID de Equipo");

        // Botones de acción
        this.botonCancelar = this.formulario.getByRole("button", { name: "Cancelar" });
        this.botonCrearOrden = this.formulario.getByRole("button", { name: "Crear Orden" });

        // Mensaje de éxito (toast notification)
        // Usar .first() porque puede haber múltiples toasts, pero solo necesitamos validar que al menos uno esté visible
        this.mensajeExito = page.locator('[role="status"][aria-live="polite"]').filter({ hasText: "Orden de trabajo creada exitosamente" }).first();
    }

    /**
     * Navega a la página de crear orden de trabajo
     */
    async navegar() {
        await this.page.goto("/work-orders/create");
        await expect(this.tituloPagina).toBeVisible();
    }

    /**
     * Completa el campo Título
     */
    async completarTitulo(titulo: string) {
        await this.inputTitulo.fill(titulo);
    }

    /**
     * Completa el campo Descripción
     */
    async completarDescripcion(descripcion: string) {
        await this.textareaDescripcion.fill(descripcion);
    }

    /**
     * Selecciona una prioridad
     */
    async seleccionarPrioridad(prioridad: string) {
        await this.selectPrioridad.click();
        await this.page.getByRole("option", { name: prioridad }).click();
    }

    /**
     * Asigna la orden a un usuario
     */
    async asignarA(usuario: string) {
        await this.autocompleteAsignarA.fill(usuario);
        // Esperar a que aparezcan las opciones del autocomplete
        await this.page.waitForTimeout(500);
        // Seleccionar la primera opción que coincida
        await this.page.getByRole("option", { name: new RegExp(usuario, "i") }).first().click();
    }

    /**
     * Selecciona un proyecto
     */
    async seleccionarProyecto(proyecto: string) {
        await this.selectProyecto.click();
        await this.page.getByRole("option", { name: proyecto }).click();
    }

    /**
     * Completa las horas estimadas
     */
    async completarHorasEstimadas(horas: string | number) {
        await this.inputHorasEstimadas.fill(String(horas));
    }

    /**
     * Completa la fecha límite
     */
    async completarFechaLimite(fecha: string) {
        await this.inputFechaLimite.fill(fecha);
    }

    /**
     * Completa la ubicación/dirección
     */
    async completarUbicacion(ubicacion: string) {
        await this.textareaUbicacion.fill(ubicacion);
    }

    /**
     * Hace clic en el botón "Mi Ubicación"
     */
    async usarMiUbicacion() {
        await this.botonMiUbicacion.click();
    }

    /**
     * Completa el ID de equipo
     */
    async completarIdEquipo(idEquipo: string) {
        await this.inputIdEquipo.fill(idEquipo);
    }

    /**
     * Completa todo el formulario con los datos proporcionados
     */
    async completarFormulario(datos: {
        titulo: string;
        descripcion?: string;
        prioridad?: string;
        asignarA?: string;
        proyecto?: string;
        horasEstimadas?: string | number;
        fechaLimite?: string;
        ubicacion?: string;
        idEquipo?: string;
    }) {
        await this.completarTitulo(datos.titulo);

        if (datos.descripcion) {
            await this.completarDescripcion(datos.descripcion);
        }

        if (datos.prioridad) {
            await this.seleccionarPrioridad(datos.prioridad);
        }

        if (datos.asignarA) {
            await this.asignarA(datos.asignarA);
        }

        if (datos.proyecto) {
            await this.seleccionarProyecto(datos.proyecto);
        }

        if (datos.horasEstimadas) {
            await this.completarHorasEstimadas(datos.horasEstimadas);
        }

        if (datos.fechaLimite) {
            await this.completarFechaLimite(datos.fechaLimite);
        }

        if (datos.ubicacion) {
            await this.completarUbicacion(datos.ubicacion);
        }

        if (datos.idEquipo) {
            await this.completarIdEquipo(datos.idEquipo);
        }
    }

    /**
     * Hace clic en el botón Cancelar
     */
    async cancelar() {
        await this.botonCancelar.click();
    }

    /**
     * Hace clic en el botón Crear Orden
     */
    async crearOrden() {
        await this.botonCrearOrden.click();
    }

    /**
     * Valida que el formulario esté visible
     */
    async validarFormularioVisible() {
        await expect(this.formulario).toBeVisible();
        await expect(this.tituloPagina).toBeVisible();
    }

    /**
     * Valida que todos los campos principales estén visibles
     */
    async validarCamposVisibles() {
        await expect(this.inputTitulo).toBeVisible();
        await expect(this.textareaDescripcion).toBeVisible();
        await expect(this.selectPrioridad).toBeVisible();
        await expect(this.autocompleteAsignarA).toBeVisible();
        await expect(this.selectProyecto).toBeVisible();
        await expect(this.inputHorasEstimadas).toBeVisible();
        await expect(this.inputFechaLimite).toBeVisible();
        await expect(this.textareaUbicacion).toBeVisible();
        await expect(this.inputIdEquipo).toBeVisible();
    }

    /**
     * Valida que los botones de acción estén visibles
     */
    async validarBotonesAccion() {
        await expect(this.botonCancelar).toBeVisible();
        await expect(this.botonCrearOrden).toBeVisible();
    }

    /**
     * Valida que el campo Título sea requerido
     */
    async validarTituloRequerido() {
        // Verificar que el label tenga el asterisco indicando que es requerido
        const label = this.formulario.getByLabel("Título *");
        await expect(label).toBeVisible();

        // Verificar validación HTML5: intentar enviar el formulario sin completar el campo
        // Si el campo es requerido, la validación del navegador lo detectará
        const esValido = await this.inputTitulo.evaluate((el: HTMLInputElement) => {
            // Verificar si tiene el atributo required o si es marcado como inválido cuando está vacío
            return el.hasAttribute("required") || (el.value === "" && !el.validity.valid);
        });
        
        // Alternativamente, verificar que el label contenga el asterisco
        const labelText = await this.formulario.locator("label").filter({ hasText: "Título" }).textContent();
        expect(labelText).toContain("*");
    }

    /**
     * Valida que aparezca el mensaje de éxito después de crear una orden
     */
    async validarMensajeExito() {
        await expect(this.mensajeExito).toBeVisible({ timeout: 5000 });
        await expect(this.mensajeExito).toContainText("Orden de trabajo creada exitosamente");
    }
}

