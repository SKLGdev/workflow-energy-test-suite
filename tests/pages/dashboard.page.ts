import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;

    // Encabezado y navegación
    readonly appTitle: Locator;
    readonly dashboardMenu: Locator;
    readonly ordersMenu: Locator;
    readonly equiposMenu: Locator;
    readonly auditoriaMenu: Locator;

    // Contenido principal
    readonly titleDashboard: Locator;
    readonly welcomeMessage: Locator;
    readonly periodoSelect: Locator;
    readonly botonExportarPDF: Locator;
    readonly botonExportarExcel: Locator;

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
        this.auditoriaMenu = nav.getByRole("button", { name: "Auditoría" });

        // Contenido principal
        const main = page.locator("main");
        this.titleDashboard = main.locator("h4.MuiTypography-h4").filter({ hasText: "Dashboard de Métricas" });
        this.welcomeMessage = main.locator("p.MuiTypography-body2").filter({ hasText: /Bienvenido, .+/ });
        this.periodoSelect = main.getByRole("combobox", { name: "Período" });
        this.botonExportarPDF = main.getByRole("button", { name: "Exportar PDF" });
        this.botonExportarExcel = main.getByRole("button", { name: "Exportar Excel" });

        // Cards de métricas - cada card tiene un p con el título y un div con el valor
        this.totalOrdenesCard = main.locator("p.MuiTypography-body2").filter({ hasText: "Total de Órdenes" });
        this.completadasCard = main.locator("p.MuiTypography-body2").filter({ hasText: "Completadas" });
        this.enProgresoCard = main.locator("p.MuiTypography-body2").filter({ hasText: "En Progreso" });
        this.pendientesCard = main.locator("p.MuiTypography-body2").filter({ hasText: "Pendientes" });
        this.atrasadasCard = main.locator("p.MuiTypography-body2").filter({ hasText: "Atrasadas" });
        this.tiempoPromedioCard = main.locator("p.MuiTypography-body2").filter({ hasText: "Tiempo Promedio" });

        // Gráficos - canvas dentro de divs con clase css-vycneo
        this.tendenciaOrdenesChart = main.locator('h6:has-text("Tendencia de Órdenes")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]');
        this.distribucionEstadoChart = main.locator('h6:has-text("Distribución por Estado")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]');
        this.distribucionPrioridadChart = main.locator('h6:has-text("Distribución por Prioridad")').locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]//canvas[@role="img"]');
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

    async validarEncabezadoSuperior(nombreUsuario: string) {
        await expect(this.appTitle).toBeVisible();
        await expect(this.getNombreUsuario(nombreUsuario)).toBeVisible();
    }

    getGraficos() {
        // Los gráficos son renderizados como canvas con role="img"
        // Están dentro del mismo contenedor MuiPaper-root que el h6 con el título
        return [
            this.tendenciaOrdenesChart,
            this.distribucionEstadoChart,
            this.distribucionPrioridadChart,
        ];
    }
}
