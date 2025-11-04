import { Locator, Page } from "@playwright/test";

export class PaginaPrincipal {
    readonly page: Page;
    readonly tituloPrincipal: Locator;
    readonly subtitulo: Locator;
    readonly botonIniciarSesion: Locator;
    readonly botonRegistrarse: Locator;
    readonly botonComenzarAhora: Locator;
    readonly botonYaTengoCuenta: Locator;
    readonly seccionCaracteristicas: Locator;
    readonly seccionRoles: Locator;
    readonly seccionMultiplataforma: Locator;

    constructor(page: Page) {
        this.page = page;

        // Encabezado principal
        this.tituloPrincipal = page.locator('h1:has-text("WorkFlow Energy")');
        this.subtitulo = page.locator('h5:has-text("Sistema de Gestión de Órdenes")');

        // Botones principales
        this.botonIniciarSesion = page.getByRole("button", { name: "Iniciar Sesión" });
        this.botonRegistrarse = page.getByRole("button", { name: "Registrarse" });
        this.botonComenzarAhora = page.getByRole("button", { name: "Comenzar Ahora" });
        this.botonYaTengoCuenta = page.getByRole("button", { name: "Ya tengo cuenta" });

        // Secciones informativas
        this.seccionCaracteristicas = page.locator('h3:has-text("Características Principales")');
        this.seccionRoles = page.locator('h3:has-text("Roles y Permisos")');
        this.seccionMultiplataforma = page.locator('h3:has-text("Sistema Multiplataforma")');
    }

    /**
     * Navega a la página principal
     */
    async ir() {
        await this.page.goto("/");
    }

    /**
     * Hace clic en el botón "Iniciar Sesión"
     */
    async iniciarSesion() {
        await this.botonIniciarSesion.click();
    }

    /**
     * Hace clic en el botón "Registrarse"
     */
    async registrarse() {
        await this.botonRegistrarse.click();
    }

    /**
     * Hace clic en "Comenzar Ahora"
     */
    async comenzarAhora() {
        await this.botonComenzarAhora.click();
    }

    /**
     * Hace clic en "Ya tengo cuenta"
     */
    async yaTengoCuenta() {
        await this.botonYaTengoCuenta.click();
    }

    /**
     * Obtiene los elementos principales de la página principal
     */
    getElementosPrincipales() {
        return [
            this.tituloPrincipal,
            this.subtitulo,
            this.botonIniciarSesion,
            this.botonRegistrarse,
            this.seccionCaracteristicas,
            this.seccionRoles,
            this.seccionMultiplataforma,
        ];
    }
}
