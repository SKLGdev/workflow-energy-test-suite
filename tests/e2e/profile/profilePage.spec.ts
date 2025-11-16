import { test, expect } from "@playwright/test";
import { ProfilePage } from "../../pages/profile.page.js";

test.describe("Profile Page", () => {
    test("Validar que los elementos de la página de perfil estén presentes", async ({ page }) => {
        const profilePage = new ProfilePage(page);

        await profilePage.navegar();

        // Validar que la página esté cargada correctamente
        await profilePage.validarCargaCorrecta();

        // Validar que todos los campos estén visibles
        await profilePage.validarCamposVisibles();

        // Validar que los valores estén presentes (no vacíos)
        const nombreCompleto = await profilePage.obtenerNombreCompleto();
        const nombreUsuario = await profilePage.obtenerNombreUsuario();
        const email = await profilePage.obtenerEmail();
        const rol = await profilePage.obtenerRol();

        expect(nombreCompleto.trim()).not.toBe("");
        expect(nombreUsuario.trim()).not.toBe("");
        expect(email.trim()).not.toBe("");
        expect(rol.trim()).not.toBe("");
    });
});

