import { Page, Locator, expect } from "@playwright/test";

export class AuditoriaPage {
    readonly page: Page;

    // Encabezado
    readonly tituloPagina: Locator;
    readonly descripcionPagina: Locator;

    // Cards de métricas
    readonly cardTotalIntentos: Locator;
    readonly cardLoginsExitosos: Locator;
    readonly cardLoginsFallidos: Locator;
    readonly cardUsuariosUnicos: Locator;

    // Sección de filtros
    readonly tituloFiltros: Locator;
    readonly filtroEstado: Locator;
    readonly filtroUsuario: Locator;
    readonly inputDireccionIP: Locator;
    readonly inputDesde: Locator;
    readonly inputHasta: Locator;
    readonly botonLimpiarFiltros: Locator;

    // Tabla de datos
    readonly tablaAuditoria: Locator;
    readonly columnasEncabezado: {
        estado: Locator;
        usuario: Locator;
        email: Locator;
        rol: Locator;
        direccionIP: Locator;
        fechaHora: Locator;
        razonFallo: Locator;
    };
    readonly filasAuditoria: Locator;
    readonly paginacion: Locator;

    constructor(page: Page) {
        this.page = page;

        // Contenido principal
        const main = page.locator("main");

        // Encabezado
        this.tituloPagina = main.locator("h1.MuiTypography-h4").filter({ hasText: "Auditoría de Accesos" });
        this.descripcionPagina = main.locator("p.MuiTypography-body1").filter({ hasText: "Historial completo de intentos de inicio de sesión en el sistema" });

        // Cards de métricas
        this.cardTotalIntentos = main.locator("p.MuiTypography-body2").filter({ hasText: "Total Intentos (30d)" });
        this.cardLoginsExitosos = main.locator("p.MuiTypography-body2").filter({ hasText: "Logins Exitosos" });
        this.cardLoginsFallidos = main.locator("p.MuiTypography-body2").filter({ hasText: "Logins Fallidos" });
        this.cardUsuariosUnicos = main.locator("p.MuiTypography-body2").filter({ hasText: "Usuarios Únicos" });

        // Sección de filtros
        this.tituloFiltros = main.locator("h6.MuiTypography-h6").filter({ hasText: "Filtros" });
        this.filtroEstado = main.locator("label").filter({ hasText: "Estado" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.filtroUsuario = main.locator("label").filter({ hasText: "Usuario" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.inputDireccionIP = main.getByLabel("Dirección IP");
        this.inputDesde = main.getByLabel("Desde");
        this.inputHasta = main.getByLabel("Hasta");
        this.botonLimpiarFiltros = main.getByRole("button", { name: "Limpiar filtros" });

        // Tabla de datos
        this.tablaAuditoria = main.locator("table.MuiTable-root");
        const thead = this.tablaAuditoria.locator("thead.MuiTableHead-root");

        this.columnasEncabezado = {
            estado: thead.getByRole("columnheader", { name: "Estado", exact: true }),
            usuario: thead.getByRole("columnheader", { name: "Usuario", exact: true }),
            email: thead.getByRole("columnheader", { name: "Email", exact: true }),
            rol: thead.getByRole("columnheader", { name: "Rol", exact: true }),
            direccionIP: thead.getByRole("columnheader", { name: "Dirección IP", exact: true }),
            fechaHora: thead.getByRole("columnheader", { name: "Fecha y Hora", exact: true }),
            razonFallo: thead.getByRole("columnheader", { name: "Razón de Fallo", exact: true }),
        };

        this.filasAuditoria = this.tablaAuditoria.locator("tbody.MuiTableBody-root tr");
        this.paginacion = main.locator("p.MuiTablePagination-selectLabel").filter({ hasText: "Registros por página:" });
    }

    /**
     * Navega a la página de auditoría
     */
    async navegar() {
        await this.page.goto("/access-logs");
        await expect(this.tituloPagina).toBeVisible();
    }

    /**
     * Valida que la página esté cargada correctamente
     */
    async validarCargaCorrecta() {
        await expect(this.tituloPagina).toBeVisible();
        await expect(this.descripcionPagina).toBeVisible();
    }

    /**
     * Valida que todas las cards de métricas estén visibles
     */
    async validarMetricasVisibles() {
        await expect(this.cardTotalIntentos).toBeVisible();
        await expect(this.cardLoginsExitosos).toBeVisible();
        await expect(this.cardLoginsFallidos).toBeVisible();
        await expect(this.cardUsuariosUnicos).toBeVisible();
    }

    /**
     * Obtiene el valor de una card de métrica
     */
    async obtenerValorMetrica(card: Locator): Promise<string> {
        const cardContent = card.locator("xpath=ancestor::div[contains(@class, 'MuiCard-root')]");
        const valor = cardContent.locator("h4.MuiTypography-h4");
        return await valor.textContent() || "";
    }

    /**
     * Valida que la sección de filtros esté visible
     */
    async validarFiltrosVisibles() {
        await expect(this.tituloFiltros).toBeVisible();
        await expect(this.filtroEstado).toBeVisible();
        await expect(this.filtroUsuario).toBeVisible();
        await expect(this.inputDireccionIP).toBeVisible();
        await expect(this.inputDesde).toBeVisible();
        await expect(this.inputHasta).toBeVisible();
        await expect(this.botonLimpiarFiltros).toBeVisible();
    }

    /**
     * Selecciona un estado en el filtro de estado
     */
    async filtrarPorEstado(estado: string) {
        await this.filtroEstado.click();
        await this.page.getByRole("option", { name: estado }).click();
    }

    /**
     * Selecciona un usuario en el filtro de usuario
     */
    async filtrarPorUsuario(usuario: string) {
        await this.filtroUsuario.click();
        await this.page.getByRole("option", { name: usuario }).click();
    }

    /**
     * Completa el campo de dirección IP
     */
    async filtrarPorDireccionIP(ip: string) {
        await this.inputDireccionIP.fill(ip);
    }

    /**
     * Completa el campo "Desde"
     */
    async filtrarPorFechaDesde(fecha: string) {
        await this.inputDesde.fill(fecha);
    }

    /**
     * Completa el campo "Hasta"
     */
    async filtrarPorFechaHasta(fecha: string) {
        await this.inputHasta.fill(fecha);
    }

    /**
     * Hace clic en el botón de limpiar filtros
     */
    async limpiarFiltros() {
        await this.botonLimpiarFiltros.click();
    }

    /**
     * Valida que todas las columnas de la tabla estén visibles
     */
    async validarColumnasTabla() {
        await expect(this.columnasEncabezado.estado).toBeVisible();
        await expect(this.columnasEncabezado.usuario).toBeVisible();
        await expect(this.columnasEncabezado.email).toBeVisible();
        await expect(this.columnasEncabezado.rol).toBeVisible();
        await expect(this.columnasEncabezado.direccionIP).toBeVisible();
        await expect(this.columnasEncabezado.fechaHora).toBeVisible();
        await expect(this.columnasEncabezado.razonFallo).toBeVisible();
    }

    /**
     * Obtiene la cantidad de filas en la tabla
     */
    async obtenerCantidadFilas(): Promise<number> {
        return await this.filasAuditoria.count();
    }

    /**
     * Obtiene el texto de una fila específica
     */
    async obtenerTextoFila(indice: number): Promise<string> {
        const fila = this.filasAuditoria.nth(indice);
        return await fila.innerText();
    }

    /**
     * Obtiene el estado de una fila específica
     */
    async obtenerEstadoFila(indice: number): Promise<string> {
        const fila = this.filasAuditoria.nth(indice);
        const estadoChip = fila.locator("div.MuiChip-root").first();
        return await estadoChip.textContent() || "";
    }

    /**
     * Valida que la paginación esté visible
     */
    async validarPaginacion() {
        await expect(this.paginacion).toBeVisible();
    }

    /**
     * Obtiene todas las cards de métricas
     */
    getCardsMetricas(): Locator[] {
        return [
            this.cardTotalIntentos,
            this.cardLoginsExitosos,
            this.cardLoginsFallidos,
            this.cardUsuariosUnicos,
        ];
    }
}

