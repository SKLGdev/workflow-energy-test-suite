import { Page, Locator, expect } from "@playwright/test";

export class TeamsPage {
    readonly page: Page;

    // Encabezado
    readonly tituloPagina: Locator;
    readonly botonCrearEquipo: Locator;

    // Grid de equipos
    readonly gridEquipos: Locator;
    readonly cardsEquipos: Locator;

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
}

