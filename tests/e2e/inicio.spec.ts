import { test, expect } from "@playwright/test";
import { PaginaPrincipal } from "../pages/paginaPrincipal.page.js";

test.describe("Pagina Principal", () => {
    test.use({ storageState: "tests/e2e/auth/noAuth.json" });

    test("Verificar que los elementos de la página principal estén visibles", async ({ page }) => {
        const principalPage = new PaginaPrincipal(page);

        await principalPage.ir();
        for (const elemento of principalPage.getElementosPrincipales()) {
            await expect(elemento).toBeVisible();
        }
    });
});
