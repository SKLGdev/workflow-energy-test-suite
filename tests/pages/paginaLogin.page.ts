import { Locator, Page } from "@playwright/test";

export class PaginaLogin {
    readonly page: Page;
    readonly logo: Locator;
    readonly titulo: Locator;
    readonly inputCorreo: Locator;
    readonly inputContrasena: Locator;
    readonly botonIniciarSesion: Locator;
    readonly enlaceOlvideContrasena: Locator;
    readonly enlaceRegistrarse: Locator;

    constructor(page: Page) {
        this.page = page;

        // Elementos principales
        this.logo = page.locator('img[alt="WorkFlow Energy Logo"]');
        this.titulo = page.getByText("Inicia sesión en tu cuenta");

        // Campos del formulario
        this.inputCorreo = page.locator('input[name="email"]');
        this.inputContrasena = page.locator('input[name="password"]');

        // Botones y enlaces
        this.botonIniciarSesion = page.getByRole("button", { name: "Iniciar Sesión" });
        this.enlaceOlvideContrasena = page.getByRole("link", { name: "¿Olvidaste tu contraseña?" });
        this.enlaceRegistrarse = page.getByRole("link", {
            name: "¿No tienes cuenta? Registrarse aquí",
        });
    }

    /**
     * Navega a la página de login
     */
    async ir() {
        await this.page.goto("/login");
    }

    /**
     * Completa el formulario de inicio de sesión
     */
    async completarFormulario(correo: string, contrasena: string) {
        await this.inputCorreo.fill(correo);
        await this.inputContrasena.fill(contrasena);
    }

    /**
     * Hace clic en el botón "Iniciar Sesión"
     */
    async iniciarSesion() {
        await this.botonIniciarSesion.click();
    }

    /**
     * Accede al flujo de "¿Olvidaste tu contraseña?"
     */
    async irARecuperarContrasena() {
        await this.enlaceOlvideContrasena.click();
    }

    /**
     * Accede al flujo de "Registrarse"
     */
    async irARegistro() {
        await this.enlaceRegistrarse.click();
    }

    /**
     * Obtiene los elementos principales de la página de login
     */
    getElementosPrincipales() {
        return [
            this.logo,
            this.titulo,
            this.inputCorreo,
            this.inputContrasena,
            this.botonIniciarSesion,
            this.enlaceOlvideContrasena,
            this.enlaceRegistrarse,
        ];
    }
}
