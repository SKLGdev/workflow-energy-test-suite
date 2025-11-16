import { Page, Locator, expect } from "@playwright/test";

export class TeamsPage {
    readonly page: Page;

    // Encabezado
    readonly tituloPagina: Locator;
    readonly botonCrearEquipo: Locator;

    // Grid de equipos
    readonly gridEquipos: Locator;
    readonly cardsEquipos: Locator;

    // Modal de crear equipo
    readonly modalCrearEquipo: Locator;
    readonly tituloModal: Locator;
    readonly inputNombreEquipo: Locator;
    readonly textareaDescripcion: Locator;
    readonly inputIdPlanta: Locator;
    readonly helperTextIdPlanta: Locator;
    readonly selectLiderEquipo: Locator;
    readonly botonCancelar: Locator;
    readonly botonCrear: Locator;

    constructor(page: Page) {
        this.page = page;

        // Contenido principal
        const main = page.locator("main");

        // Encabezado
        this.tituloPagina = main.locator("h4.MuiTypography-h4").filter({ hasText: "Equipos" });
        this.botonCrearEquipo = main.getByRole("button", { name: "Crear Equipo" });

        // Grid de equipos
        this.gridEquipos = main.locator("div.MuiGrid-container");
        this.cardsEquipos = main.locator("div.MuiCard-root");

        // Modal de crear equipo
        this.modalCrearEquipo = page.locator("div.MuiDialog-paper");
        this.tituloModal = this.modalCrearEquipo.locator("h2.MuiDialogTitle-root").filter({ hasText: "Crear Nuevo Equipo" });
        this.inputNombreEquipo = this.modalCrearEquipo.getByLabel("Nombre del Equipo *");
        this.textareaDescripcion = this.modalCrearEquipo.getByLabel("Descripción");
        this.inputIdPlanta = this.modalCrearEquipo.getByLabel("ID de Planta (opcional)");
        this.helperTextIdPlanta = this.modalCrearEquipo.locator("p.MuiFormHelperText-root").filter({ hasText: "Deja en blanco si no tienes plantas configuradas" });
        this.selectLiderEquipo = this.modalCrearEquipo.locator("label").filter({ hasText: "Líder del Equipo (opcional)" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.botonCancelar = this.modalCrearEquipo.getByRole("button", { name: "Cancelar" });
        this.botonCrear = this.modalCrearEquipo.getByRole("button", { name: "Crear" });
    }

    /**
     * Navega a la página de equipos
     */
    async navegar() {
        await this.page.goto("/teams");
        await expect(this.tituloPagina).toBeVisible();
    }

    /**
     * Obtiene el locator de una card de equipo por su título
     */
    getCardEquipoPorTitulo(titulo: string): Locator {
        return this.cardsEquipos.filter({ hasText: titulo });
    }

    /**
     * Obtiene el botón "Ver Detalles" de una card específica
     */
    getBotonVerDetalles(card: Locator): Locator {
        return card.getByRole("button", { name: "Ver Detalles" });
    }

    /**
     * Obtiene el botón "Editar" de una card específica
     */
    getBotonEditar(card: Locator): Locator {
        return card.getByRole("button", { name: "Editar" });
    }

    /**
     * Obtiene el botón "Eliminar" de una card específica
     */
    getBotonEliminar(card: Locator): Locator {
        return card.getByRole("button", { name: "Eliminar" });
    }

    /**
     * Obtiene el título de una card
     */
    getTituloCard(card: Locator): Locator {
        return card.locator("h6.MuiTypography-h6");
    }

    /**
     * Obtiene la descripción de una card
     */
    getDescripcionCard(card: Locator): Locator {
        return card.locator("p.MuiTypography-body2");
    }

    /**
     * Obtiene el chip de líder de una card (si existe)
     */
    getChipLider(card: Locator): Locator {
        return card.locator("div.MuiChip-root").filter({ hasText: /Líder:/ });
    }

    /**
     * Obtiene el chip de planta de una card (si existe)
     */
    getChipPlanta(card: Locator): Locator {
        return card.locator("div.MuiChip-root").filter({ hasText: /Planta:/ });
    }

    /**
     * Hace clic en el botón "Crear Equipo"
     */
    async clickCrearEquipo() {
        await this.botonCrearEquipo.click();
    }

    /**
     * Hace clic en "Ver Detalles" de un equipo específico
     */
    async verDetallesEquipo(tituloEquipo: string) {
        const card = this.getCardEquipoPorTitulo(tituloEquipo);
        await this.getBotonVerDetalles(card).click();
    }

    /**
     * Hace clic en "Editar" de un equipo específico
     */
    async editarEquipo(tituloEquipo: string) {
        const card = this.getCardEquipoPorTitulo(tituloEquipo);
        await this.getBotonEditar(card).click();
    }

    /**
     * Hace clic en "Eliminar" de un equipo específico
     */
    async eliminarEquipo(tituloEquipo: string) {
        const card = this.getCardEquipoPorTitulo(tituloEquipo);
        await this.getBotonEliminar(card).click();
    }

    /**
     * Obtiene la cantidad de cards de equipos visibles
     */
    async obtenerCantidadEquipos(): Promise<number> {
        return await this.cardsEquipos.count();
    }

    /**
     * Valida que la página esté cargada correctamente
     */
    async validarCargaCorrecta() {
        await expect(this.tituloPagina).toBeVisible();
        await expect(this.botonCrearEquipo).toBeVisible();
        await expect(this.gridEquipos).toBeVisible();
    }

    /**
     * Valida que haya al menos un equipo en la página
     */
    async validarEquiposPresentes() {
        const cantidad = await this.obtenerCantidadEquipos();
        expect(cantidad).toBeGreaterThan(0);
    }

    /**
     * Valida que una card de equipo tenga los elementos esperados
     */
    async validarCardEquipo(tituloEquipo: string) {
        const card = this.getCardEquipoPorTitulo(tituloEquipo);
        await expect(card).toBeVisible();
        await expect(this.getTituloCard(card)).toBeVisible();
        await expect(this.getBotonVerDetalles(card)).toBeVisible();
        await expect(this.getBotonEditar(card)).toBeVisible();
        await expect(this.getBotonEliminar(card)).toBeVisible();
    }

    /**
     * Obtiene todos los títulos de los equipos
     */
    async obtenerTitulosEquipos(): Promise<string[]> {
        const titulos: string[] = [];
        const cantidad = await this.obtenerCantidadEquipos();
        
        for (let i = 0; i < cantidad; i++) {
            const card = this.cardsEquipos.nth(i);
            const titulo = await this.getTituloCard(card).textContent();
            if (titulo) {
                titulos.push(titulo.trim());
            }
        }
        
        return titulos;
    }

    // ====== Modal de Crear Equipo ======

    /**
     * Valida que el modal de crear equipo esté visible
     */
    async validarModalCrearEquipoVisible() {
        await expect(this.modalCrearEquipo).toBeVisible();
        await expect(this.tituloModal).toBeVisible();
    }

    /**
     * Valida que todos los campos del modal estén visibles
     */
    async validarCamposModalCrearEquipo() {
        await expect(this.inputNombreEquipo).toBeVisible();
        await expect(this.textareaDescripcion).toBeVisible();
        await expect(this.inputIdPlanta).toBeVisible();
        await expect(this.selectLiderEquipo).toBeVisible();
        await expect(this.botonCancelar).toBeVisible();
        await expect(this.botonCrear).toBeVisible();
    }

    /**
     * Completa el campo Nombre del Equipo
     */
    async completarNombreEquipo(nombre: string) {
        await this.inputNombreEquipo.fill(nombre);
    }

    /**
     * Completa el campo Descripción
     */
    async completarDescripcion(descripcion: string) {
        await this.textareaDescripcion.fill(descripcion);
    }

    /**
     * Completa el campo ID de Planta
     */
    async completarIdPlanta(idPlanta: string | number) {
        await this.inputIdPlanta.fill(String(idPlanta));
    }

    /**
     * Selecciona un líder del equipo
     */
    async seleccionarLiderEquipo(nombreLider: string) {
        await this.selectLiderEquipo.click();
        await this.page.getByRole("option", { name: nombreLider }).click();
    }

    /**
     * Completa todo el formulario de crear equipo
     */
    async completarFormularioCrearEquipo(datos: {
        nombre: string;
        descripcion?: string;
        idPlanta?: string | number;
        liderEquipo?: string;
    }) {
        await this.completarNombreEquipo(datos.nombre);

        if (datos.descripcion) {
            await this.completarDescripcion(datos.descripcion);
        }

        if (datos.idPlanta !== undefined) {
            await this.completarIdPlanta(datos.idPlanta);
        }

        if (datos.liderEquipo) {
            await this.seleccionarLiderEquipo(datos.liderEquipo);
        }
    }

    /**
     * Hace clic en el botón Cancelar del modal
     */
    async cancelarCreacionEquipo() {
        await this.botonCancelar.click();
    }

    /**
     * Hace clic en el botón Crear del modal
     */
    async confirmarCreacionEquipo() {
        await this.botonCrear.click();
    }

    /**
     * Crea un equipo completo: abre el modal, completa el formulario y confirma
     */
    async crearEquipo(datos: {
        nombre: string;
        descripcion?: string;
        idPlanta?: string | number;
        liderEquipo?: string;
    }) {
        await this.clickCrearEquipo();
        await this.validarModalCrearEquipoVisible();
        await this.completarFormularioCrearEquipo(datos);
        await this.confirmarCreacionEquipo();
    }

    /**
     * Valida que el campo Nombre del Equipo sea requerido
     */
    async validarNombreEquipoRequerido() {
        const label = this.modalCrearEquipo.getByLabel("Nombre del Equipo *");
        await expect(label).toBeVisible();

        // Verificar que el input tenga el atributo required
        const esRequerido = await this.inputNombreEquipo.getAttribute("required");
        expect(esRequerido).not.toBeNull();
    }
}

