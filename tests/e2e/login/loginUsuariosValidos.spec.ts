import { test, expect } from "@playwright/test";
import { PaginaLogin } from "../../pages/paginaLogin.page.js";

test.describe("Login de usuarios válidos", () => {
    const usuarios = [
        { rol: "admin", email: process.env.ADMIN_USER, password: process.env.ADMIN_PASS },
        { rol: "supervisor", email: process.env.SUPERVISOR_USER, password: process.env.SUPERVISOR_PASS },
        { rol: "jefe", email: process.env.JEFE_USER, password: process.env.JEFE_PASS },
        { rol: "empleado", email: process.env.EMPLEADO_USER, password: process.env.EMPLEADO_PASS },
    ];

    for (const usuario of usuarios) {
        test.use({ storageState: "tests/e2e/auth/noAuth.json" });

        test(`Debería permitir iniciar sesión con credenciales válidas como ${usuario.rol}`, async ({ page }) => {
            const loginPage = new PaginaLogin(page);

            await loginPage.ir();
            await loginPage.completarFormulario(String(usuario.email), String(usuario.password));
            await loginPage.iniciarSesion();

            await expect(page).toHaveURL(`${String(process.env.BASE_URL)}/login`);
        });
    }
});
