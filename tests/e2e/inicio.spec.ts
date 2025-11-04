import { test, expect } from '@playwright/test';
import { PaginaPrincipal } from '../pages/paginaPrincipal.page';

test.describe('Pagina Principal', () => {
    test('Verificar que los elementos de la página principal estén visibles', async ({ page }) => {
        const paginaPrincipalPage = new PaginaPrincipal(page);

        await paginaPrincipalPage.ir();
        for (const elemento of paginaPrincipalPage.getElementosPrincipales()) {
            await expect(elemento).toBeVisible();
        }
    });
})