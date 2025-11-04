import { test, expect } from "@playwright/test";
import { PaginaLogin } from "../../pages/paginaLogin.page.js";

test.describe("Página de Login", () => {
    test.use({ storageState: "tests/e2e/auth/noAuth.json" });

    test("Verificar que los elementos de la página de login estén visibles", async ({ page }) => {
        const loginPage = new PaginaLogin(page);

        await loginPage.ir();
        for (const elemento of loginPage.getElementosPrincipales()) {
            await expect(elemento).toBeVisible();
        }
    });
});
