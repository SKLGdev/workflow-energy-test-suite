import { Page, Locator, expect } from "@playwright/test";

export class NavbarPage {
    readonly page: Page;

    // Elementos del navbar
    readonly navbar: Locator;
    readonly tituloNavbar: Locator;
    readonly dashboardMenu: Locator;
    readonly ordenesMenu: Locator;
    readonly equiposMenu: Locator;
    readonly auditoriaMenu: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navbar principal
        this.navbar = page.locator("nav");

        // Título del navbar
        this.tituloNavbar = this.navbar.locator("div.MuiTypography-h6");

        // Items del menú - cada uno es un botón dentro de un li
        this.dashboardMenu = this.navbar.getByRole("button", { name: "Dashboard" });
        this.ordenesMenu = this.navbar.getByRole("button", { name: "Órdenes" });
        this.equiposMenu = this.navbar.getByRole("button", { name: "Equipos" });
        this.auditoriaMenu = this.navbar.getByRole("button", { name: "Auditoría" });
    }

    /**
     * Valida que el navbar esté visible
     */
    async validarNavbarVisible() {
        await expect(this.navbar).toBeVisible();
    }

    /**
     * Valida que el título del navbar esté visible
     */
    async validarTituloNavbar() {
        await expect(this.tituloNavbar).toBeVisible();
    }

    /**
     * Valida que todos los elementos del menú estén visibles
     */
    async validarElementosMenu() {
        await expect(this.dashboardMenu).toBeVisible();
        await expect(this.ordenesMenu).toBeVisible();
        await expect(this.equiposMenu).toBeVisible();
        await expect(this.auditoriaMenu).toBeVisible();
    }

    /**
     * Valida que un elemento del menú esté seleccionado
     */
    async validarMenuSeleccionado(nombreMenu: string) {
        const menu = this.navbar.getByRole("button", { name: nombreMenu });
        await expect(menu).toHaveClass(/Mui-selected/);
    }

    /**
     * Navega a una sección desde el navbar
     */
    async navegarA(nombreMenu: string) {
        const menu = this.navbar.getByRole("button", { name: nombreMenu });
        await menu.click();
    }

    /**
     * Obtiene todos los elementos del menú
     */
    getElementosMenu() {
        return [
            this.dashboardMenu,
            this.ordenesMenu,
            this.equiposMenu,
            this.auditoriaMenu,
        ];
    }
}

