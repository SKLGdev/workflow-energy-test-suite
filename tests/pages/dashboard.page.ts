import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;

    // Encabezado y navegación
    readonly appTitle: Locator;
    readonly userName: Locator;
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

        // Header y barra lateral
        this.appTitle = page.getByText("Work Order Management System");
        this.userName = page.getByText("Ana Administradora");
        this.dashboardMenu = page.getByRole("button", { name: "Dashboard" });
        this.ordersMenu = page.getByRole("button", { name: "Órdenes" });
        this.equiposMenu = page.getByRole("button", { name: "Equipos" });
        this.reportesMenu = page.getByRole("button", { name: "Reportes" });
        this.configuracionMenu = page.getByRole("button", { name: "Configuración" });

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
