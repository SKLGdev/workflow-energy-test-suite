import { test, expect } from "@playwright/test";
import { PaginaLogin } from "../../pages/paginaLogin.page.js";

test.describe("Casos negativos - Login de WorkFlow Energy", () => {
    test.use({ storageState: "tests/e2e/auth/noAuth.json" });

    test("No debería permitir iniciar sesión con campos vacíos", async ({ page }) => {
        const login = new PaginaLogin(page);
        await login.navegar();

        await login.iniciarSesion();

        await expect(page).toHaveURL(/\/login$/);

        const correoInput = login.inputCorreo;
        const contrasenaInput = login.inputContrasena;

        const correoEsValido = await correoInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        const contrasenaEsValida = await contrasenaInput.evaluate((el: HTMLInputElement) => el.validity.valid);

        expect(correoEsValido).toBeFalsy();
        expect(contrasenaEsValida).toBeFalsy();
    });

    test("No debería permitir iniciar sesión con correo inválido", async ({ page }) => {
        const login = new PaginaLogin(page);
        await login.navegar();

        await login.completarFormulario("correoInvalido", "12345678");
        await login.iniciarSesion();

        const correoInput = login.inputCorreo;
        const esValido = await correoInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(esValido).toBeFalsy();
    });

    test("No debería permitir iniciar sesión con contraseña vacía", async ({ page }) => {
        const login = new PaginaLogin(page);
        await login.navegar();

        await login.completarFormulario("pepe@gmail.com", "");
        await login.iniciarSesion();

        await expect(page).toHaveURL(/\/login$/);

        const contrasenaInput = login.inputContrasena;
        const contrasenaEsValida = await contrasenaInput.evaluate((el: HTMLInputElement) => el.validity.valid);

        expect(contrasenaEsValida).toBeFalsy();
    });

    test("No debería permitir iniciar sesión con credenciales incorrectas", async ({ page }) => {
        const login = new PaginaLogin(page);
        await login.navegar();

        // Esperar la respuesta de la API antes de hacer clic
        const responsePromise = page.waitForResponse(
            (response) => response.url().includes("/login") && response.request().method() === "POST"
        );

        await login.completarFormulario("usuario@noexiste.com", "claveIncorrecta");
        await login.iniciarSesion();

        // Esperar y validar la respuesta de la API
        const response = await responsePromise;
        expect(response.status()).toBe(401); // Unauthorized

        // También validar el cuerpo de la respuesta si es necesario
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message");
        expect(responseBody.message).toMatch(/Credenciales (inválidas|incorrectas)/i);

        // Validar el mensaje en la UI
        await login.esperarMensajeError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    });

    test("Debería mostrar error al intentar login con email válido pero contraseña muy corta", async ({ page }) => {
        const login = new PaginaLogin(page);
        await login.navegar();

        // Esperar la respuesta de la API antes de hacer clic
        const responsePromise = page.waitForResponse(
            (response) => response.url().includes("/login") && response.request().method() === "POST"
        );

        await login.completarFormulario("pepe@gmail.com", "12");
        await login.iniciarSesion();

        // Esperar y validar la respuesta de la API
        const response = await responsePromise;
        expect(response.status()).toBe(401); // Unauthorized

        // También validar el cuerpo de la respuesta si es necesario
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("message");
        expect(responseBody.message).toMatch(/Credenciales (inválidas|incorrectas)/i);

        await login.esperarMensajeError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    });
});
