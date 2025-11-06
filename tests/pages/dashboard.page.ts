import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;

    // Encabezado y navegación
    readonly appTitle: Locator;
    readonly dashboardMenu: Locator;
    readonly ordersMenu: Locator;
    readonly equiposMenu: Locator;
    readonly reportesMenu: Locator;
    readonly configuracionMenu: Locator;

    // Contenido principal
    readonly titleDashboard: Locator;
    readonly welcomeMessage: Locator;
    readonly periodoSelect: Locator;

    // Métricas
    readonly totalOrdenesCard: Locator;
    readonly completadasCard: Locator;
    readonly enProgresoCard: Locator;
    readonly pendientesCard: Locator;
    readonly atrasadasCard: Locator;
    readonly tiempoPromedioCard: Locator;

    // Gráficos
    readonly tendenciaOrdenesChart: Locator;
    readonly distribucionEstadoChart: Locator;
    readonly distribucionPrioridadChart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header
        const header = page.locator("header");
        this.appTitle = header.locator("div.MuiTypography-h6").filter({ hasText: "Work Order Management System" });

        // Navegación lateral
        const nav = page.locator("nav");
        this.dashboardMenu = nav.getByRole("button", { name: "Dashboard" });
        this.ordersMenu = nav.getByRole("button", { name: "Órdenes" });
        this.equiposMenu = nav.getByRole("button", { name: "Equipos" });
        this.reportesMenu = nav.getByRole("button", { name: "Reportes" });
        this.configuracionMenu = nav.getByRole("button", { name: "Configuración" });

        // Contenido
        this.titleDashboard = page.getByRole("heading", { name: "Dashboard de Métricas" });
        this.welcomeMessage = page.getByText(/Bienvenido, .+/);
        this.periodoSelect = page.getByRole("combobox", { name: "Período" });

        // Cards
        this.totalOrdenesCard = page.getByText("Total de Órdenes");
        this.completadasCard = page.getByText("Completadas");
        this.enProgresoCard = page.getByText("En Progreso");
        this.pendientesCard = page.getByText("Pendientes");
        this.atrasadasCard = page.getByText("Atrasadas");
        this.tiempoPromedioCard = page.getByText("Tiempo Promedio");

        // Gráficos
        this.tendenciaOrdenesChart = page.getByRole("img", { name: /Tendencia de Órdenes/i });
        this.distribucionEstadoChart = page.getByRole("img", { name: /Distribución por Estado/i });
        this.distribucionPrioridadChart = page.getByRole("img", { name: /Distribución por Prioridad/i });
    }

    async navegar() {
        await this.page.goto("/dashboard");
        await expect(this.titleDashboard).toBeVisible();
    }

    async selectPeriodo(opcion: string) {
        await this.periodoSelect.click();
        await this.page.getByRole("option", { name: opcion }).click();
    }

    getDatosMetricas() {
        return [
            this.totalOrdenesCard,
            this.completadasCard,
            this.enProgresoCard,
            this.pendientesCard,
            this.atrasadasCard,
            this.tiempoPromedioCard,
        ];
    }

    async validarBienvenida(nombre: string) {
        await expect(this.welcomeMessage).toContainText(nombre);
    }

    getNombreUsuario(nombreUsuario: string) {
        return this.page.locator("header").getByText(nombreUsuario, { exact: true });
    }

    async validarNavegacionLateral(incluirConfiguracion: boolean = true) {
        await expect(this.dashboardMenu).toBeVisible();
        await expect(this.ordersMenu).toBeVisible();
        await expect(this.equiposMenu).toBeVisible();
        await expect(this.reportesMenu).toBeVisible();
        if (incluirConfiguracion) {
            await expect(this.configuracionMenu).toBeVisible();
        }
    }

    async validarEncabezadoSuperior(nombreUsuario: string) {
        await expect(this.appTitle).toBeVisible();
        await expect(this.getNombreUsuario(nombreUsuario)).toBeVisible();
    }

    getGraficos() {
        // Los gráficos son renderizados como canvas con role="img"
        // Están dentro del mismo contenedor MuiPaper-root que el h6 con el título
        return [
            this.page.locator('h6:has-text("Tendencia de Órdenes")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]'),
            this.page.locator('h6:has-text("Distribución por Estado")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]'),
            this.page.locator('h6:has-text("Distribución por Prioridad")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]'),
        ];
    }
}
