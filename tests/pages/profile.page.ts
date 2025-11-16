import { Page, Locator, expect } from "@playwright/test";

export class ProfilePage {
    readonly page: Page;

    // Encabezado
    readonly tituloPagina: Locator;

    // Sección de información personal
    readonly seccionInformacionPersonal: Locator;
    readonly tituloInformacionPersonal: Locator;

    // Campos de información
    readonly labelNombreCompleto: Locator;
    readonly valorNombreCompleto: Locator;
    readonly labelNombreUsuario: Locator;
    readonly valorNombreUsuario: Locator;
    readonly labelEmail: Locator;
    readonly valorEmail: Locator;
    readonly labelRol: Locator;
    readonly chipRol: Locator;

    constructor(page: Page) {
        this.page = page;

        // Contenido principal
        const main = page.locator("main");

        // Encabezado
        this.tituloPagina = main.locator("h4.MuiTypography-h4").filter({ hasText: "Mi Perfil" });

        // Sección de información personal
        this.seccionInformacionPersonal = main.locator("div.MuiPaper-root");
        this.tituloInformacionPersonal = this.seccionInformacionPersonal.locator("h6.MuiTypography-h6").filter({ hasText: "Información Personal" });

        // Campos de información - usando el Grid container
        const gridContainer = this.seccionInformacionPersonal.locator("div.MuiGrid-container");

        // Nombre Completo
        this.labelNombreCompleto = gridContainer.locator("h6.MuiTypography-subtitle2").filter({ hasText: "Nombre Completo" });
        this.valorNombreCompleto = this.labelNombreCompleto.locator("xpath=following-sibling::p[1]");

        // Nombre de Usuario
        this.labelNombreUsuario = gridContainer.locator("h6.MuiTypography-subtitle2").filter({ hasText: "Nombre de Usuario" });
        this.valorNombreUsuario = this.labelNombreUsuario.locator("xpath=following-sibling::p[1]");

        // Email
        this.labelEmail = gridContainer.locator("h6.MuiTypography-subtitle2").filter({ hasText: "Email" });
        this.valorEmail = this.labelEmail.locator("xpath=following-sibling::p[1]");

        // Rol
        this.labelRol = gridContainer.locator("h6.MuiTypography-subtitle2").filter({ hasText: "Rol" });
        this.chipRol = this.labelRol.locator("xpath=following-sibling::div[1]//span[contains(@class, 'MuiChip-label')]");
    }

    /**
     * Navega a la página de perfil
     */
    async navegar() {
        await this.page.goto("/profile");
        await expect(this.tituloPagina).toBeVisible();
    }

    /**
     * Valida que la página esté cargada correctamente
     */
    async validarCargaCorrecta() {
        await expect(this.tituloPagina).toBeVisible();
        await expect(this.seccionInformacionPersonal).toBeVisible();
        await expect(this.tituloInformacionPersonal).toBeVisible();
    }

    /**
     * Valida que todos los campos de información estén visibles
     */
    async validarCamposVisibles() {
        await expect(this.labelNombreCompleto).toBeVisible();
        await expect(this.valorNombreCompleto).toBeVisible();
        await expect(this.labelNombreUsuario).toBeVisible();
        await expect(this.valorNombreUsuario).toBeVisible();
        await expect(this.labelEmail).toBeVisible();
        await expect(this.valorEmail).toBeVisible();
        await expect(this.labelRol).toBeVisible();
        await expect(this.chipRol).toBeVisible();
    }

    /**
     * Obtiene el valor del nombre completo
     */
    async obtenerNombreCompleto(): Promise<string> {
        return await this.valorNombreCompleto.textContent() || "";
    }

    /**
     * Obtiene el valor del nombre de usuario
     */
    async obtenerNombreUsuario(): Promise<string> {
        return await this.valorNombreUsuario.textContent() || "";
    }

    /**
     * Obtiene el valor del email
     */
    async obtenerEmail(): Promise<string> {
        return await this.valorEmail.textContent() || "";
    }

    /**
     * Obtiene el valor del rol
     */
    async obtenerRol(): Promise<string> {
        return await this.chipRol.textContent() || "";
    }

    /**
     * Valida que el nombre completo coincida con el valor esperado
     */
    async validarNombreCompleto(nombreEsperado: string) {
        const nombreActual = await this.obtenerNombreCompleto();
        expect(nombreActual.trim()).toBe(nombreEsperado);
    }

    /**
     * Valida que el nombre de usuario coincida con el valor esperado
     */
    async validarNombreUsuario(usuarioEsperado: string) {
        const usuarioActual = await this.obtenerNombreUsuario();
        expect(usuarioActual.trim()).toBe(usuarioEsperado);
    }

    /**
     * Valida que el email coincida con el valor esperado
     */
    async validarEmail(emailEsperado: string) {
        const emailActual = await this.obtenerEmail();
        expect(emailActual.trim()).toBe(emailEsperado);
    }

    /**
     * Valida que el rol coincida con el valor esperado
     */
    async validarRol(rolEsperado: string) {
        const rolActual = await this.obtenerRol();
        expect(rolActual.trim()).toBe(rolEsperado);
    }

    /**
     * Valida toda la información del perfil
     */
    async validarInformacionPerfil(datos: {
        nombreCompleto: string;
        nombreUsuario: string;
        email: string;
        rol: string;
    }) {
        await this.validarNombreCompleto(datos.nombreCompleto);
        await this.validarNombreUsuario(datos.nombreUsuario);
        await this.validarEmail(datos.email);
        await this.validarRol(datos.rol);
    }
}

