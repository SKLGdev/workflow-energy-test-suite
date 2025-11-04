import { Locator, Page, expect } from "@playwright/test";

export class PaginaLogin {
    readonly page: Page;
    readonly logo: Locator;
    readonly titulo: Locator;
    readonly inputCorreo: Locator;
    readonly inputContrasena: Locator;
    readonly botonIniciarSesion: Locator;
    readonly enlaceOlvideContrasena: Locator;
    readonly enlaceRegistrarse: Locator;
    readonly toastError: Locator;

    constructor(page: Page) {
        this.page = page;

        // Elementos principales
        this.logo = page.locator('img[alt="WorkFlow Energy Logo"]');
        this.titulo = page.locator("p", { hasText: "Inicia sesión en tu cuenta" });

        // Campos del formulario
        this.inputCorreo = page.locator('input#email[name="email"]');
        this.inputContrasena = page.locator('input#password[name="password"]');

        // Botones y enlaces
        this.botonIniciarSesion = page.getByRole("button", { name: /^Iniciar Sesión$/i });
        this.enlaceOlvideContrasena = page.getByRole("link", { name: "¿Olvidaste tu contraseña?" });
        this.enlaceRegistrarse = page.getByRole("link", {
            name: "¿No tienes cuenta? Registrarse aquí",
        });

        // Notificaciones o errores tipo "toast" (React Hot Toast)
        this.toastError = page.locator('[data-rht-toaster] [role="status"], [data-rht-toaster] div[aria-live]').first();
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

    /**
     * Espera y valida que aparezca un mensaje de error (toast)
     */
    async esperarMensajeError(textoEsperado?: string) {
        // Esperar a que el contenedor del toaster esté presente
        await this.page.waitForSelector("[data-rht-toaster]", { state: "attached", timeout: 5000 });

        // Esperar a que aparezca el toast (puede tardar un poco en renderizarse)
        const toast = this.toastError;
        await expect(toast).toBeVisible({ timeout: 10000 });

        if (textoEsperado) {
            await expect(toast).toContainText(textoEsperado, { timeout: 5000 });
        }
    }

    /**
     * Retorna el texto actual del mensaje de error (útil para asserts personalizados)
     */
    async obtenerTextoError(): Promise<string> {
        return (await this.toastError.textContent()) || "";
    }
}
