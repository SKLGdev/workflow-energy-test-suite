import { Page, Locator, expect } from "@playwright/test";

export class PaginaWorkOrders {
    readonly page: Page;

    // ====== 🧭 Navegación lateral ======
    readonly dashboardMenu: Locator;
    readonly ordenesMenu: Locator;
    readonly equiposMenu: Locator;
    readonly auditoriaMenu: Locator;

    // ====== 👤 Encabezado superior ======
    readonly appTitle: Locator;
    readonly tituloSeccion: Locator;
    readonly botonNuevaOrden: Locator;

    // ====== 📋 Encabezado de la sección ======
    readonly totalCard: Locator;
    readonly pendientesCard: Locator;
    readonly enProgresoCard: Locator;
    readonly completadasCard: Locator;

    // ====== 🔎 Filtros ======
    readonly buscadorOrdenes: Locator;
    readonly filtroEstado: Locator;
    readonly filtroPrioridad: Locator;

    // ====== 📄 Tabla de órdenes ======
    readonly tablaOrdenes: Locator;
    readonly columnasEncabezado: {
        id: Locator;
        titulo: Locator;
        estado: Locator;
        prioridad: Locator;
        asignadoA: Locator;
        fechaCreacion: Locator;
        fechaLimite: Locator;
        acciones: Locator;
    };

    readonly filasOrden: Locator;
    readonly paginacion: Locator;

    constructor(page: Page) {
        this.page = page;

        // ====== Navegación lateral ======
        const nav = page.locator("nav");
        this.dashboardMenu = nav.getByRole("button", { name: "Dashboard" });
        this.ordenesMenu = nav.getByRole("button", { name: "Órdenes" });
        this.equiposMenu = nav.getByRole("button", { name: "Equipos" });
        this.auditoriaMenu = nav.getByRole("button", { name: "Auditoría" });

        // ====== Header ======
        const header = page.locator("header");
        this.appTitle = header.locator("div.MuiTypography-h6").filter({ hasText: "Work Order Management System" });

        // ====== Contenido principal ======
        const main = page.locator("main");
        
        // Título de la sección y botón Nueva Orden
        this.tituloSeccion = main.locator("h4.MuiTypography-h4").filter({ hasText: "Gestión de Órdenes" });
        this.botonNuevaOrden = main.getByRole("button", { name: "Nueva Orden" });

        // Cards de métricas - cada card tiene un p con el título y un h4 con el valor
        this.totalCard = main.locator("p.MuiTypography-body1").filter({ hasText: "Total" });
        this.pendientesCard = main.locator("p.MuiTypography-body1").filter({ hasText: "Pendientes" });
        this.enProgresoCard = main.locator("p.MuiTypography-body1").filter({ hasText: "En Progreso" });
        this.completadasCard = main.locator("p.MuiTypography-body1").filter({ hasText: "Completadas" });

        // ====== Filtros ======
        this.buscadorOrdenes = main.getByPlaceholder("Buscar órdenes...");
        this.filtroEstado = main.locator("label").filter({ hasText: "Estado" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");
        this.filtroPrioridad = main.locator("label").filter({ hasText: "Prioridad" }).locator("xpath=ancestor::div[contains(@class, 'MuiFormControl-root')]//div[@role='combobox']");

        // ====== Tabla de datos ======
        this.tablaOrdenes = main.locator("table.MuiTable-root");
        const thead = this.tablaOrdenes.locator("thead.MuiTableHead-root");

        this.columnasEncabezado = {
            id: thead.getByRole("columnheader", { name: "ID", exact: true }),
            titulo: thead.getByRole("columnheader", { name: "Título", exact: true }),
            estado: thead.getByRole("columnheader", { name: "Estado", exact: true }),
            prioridad: thead.getByRole("columnheader", { name: "Prioridad", exact: true }),
            asignadoA: thead.getByRole("columnheader", { name: "Asignado a", exact: true }),
            fechaCreacion: thead.getByRole("columnheader", { name: "Fecha Creación", exact: true }),
            fechaLimite: thead.getByRole("columnheader", { name: "Fecha Límite", exact: true }),
            acciones: thead.getByRole("columnheader", { name: "Acciones", exact: true }),
        };

        this.filasOrden = this.tablaOrdenes.locator("tbody.MuiTableBody-root tr");
        this.paginacion = main.locator("p.MuiTablePagination-selectLabel").filter({ hasText: "Rows per page:" });
    }

    // ====== 🌐 Navegación ======
    async navegar() {
        await this.page.goto("/work-orders");
    }

    // ====== ✅ Validaciones ======
    async validarCargaCorrecta() {
        await expect(this.appTitle).toBeVisible();
        await expect(this.tituloSeccion).toBeVisible();
        await expect(this.tablaOrdenes).toBeVisible();
    }

    async validarMetricasVisibles() {
        await expect(this.totalCard).toBeVisible();
        await expect(this.pendientesCard).toBeVisible();
        await expect(this.enProgresoCard).toBeVisible();
        await expect(this.completadasCard).toBeVisible();
    }

    getNombreUsuario(nombreUsuario: string) {
        return this.page.locator("header").getByText(nombreUsuario, { exact: true });
    }

    async validarEncabezadoSuperior(nombreUsuario: string) {
        await expect(this.getNombreUsuario(nombreUsuario)).toBeVisible();
        await expect(this.botonNuevaOrden).toBeVisible();
    }

    async validarFiltros() {
        await expect(this.buscadorOrdenes).toBeVisible();
        await expect(this.filtroEstado).toBeVisible();
        await expect(this.filtroPrioridad).toBeVisible();
    }

    async validarColumnasTabla() {
        await expect(this.columnasEncabezado.id).toBeVisible();
        await expect(this.columnasEncabezado.titulo).toBeVisible();
        await expect(this.columnasEncabezado.estado).toBeVisible();
        await expect(this.columnasEncabezado.prioridad).toBeVisible();
        await expect(this.columnasEncabezado.asignadoA).toBeVisible();
        await expect(this.columnasEncabezado.fechaCreacion).toBeVisible();
        await expect(this.columnasEncabezado.fechaLimite).toBeVisible();
        await expect(this.columnasEncabezado.acciones).toBeVisible();
    }

    async validarPaginacion() {
        await expect(this.paginacion).toBeVisible();
    }

    // ====== 🔍 Búsquedas y filtros ======
    async buscarOrden(termino: string) {
        await this.buscadorOrdenes.fill(termino);
        await this.page.keyboard.press("Enter");
    }

    async filtrarPorEstado(estado: string) {
        await this.filtroEstado.click();
        await this.page.getByRole("option", { name: estado }).click();
    }

    async filtrarPorPrioridad(prioridad: string) {
        await this.filtroPrioridad.click();
        await this.page.getByRole("option", { name: prioridad }).click();
    }

    // ====== 📄 Tabla ======
    async obtenerCantidadDeFilas(): Promise<number> {
        return await this.filasOrden.count();
    }

    async obtenerTextoDeFila(indice: number) {
        const fila = this.filasOrden.nth(indice);
        return await fila.innerText();
    }

    // ====== ➕ Crear nueva orden ======
    async clickNuevaOrden() {
        await this.botonNuevaOrden.click();
    }
}
