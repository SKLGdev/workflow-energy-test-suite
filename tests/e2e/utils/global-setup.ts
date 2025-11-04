import { request, chromium, FullConfig } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup(config: FullConfig) {
    const baseURL = process.env.BASE_URL || config.projects[0].use?.baseURL;
    if (!baseURL) {
        console.error("[FATAL] No se definió BASE_URL en playwright.config.ts o en .env");
        process.exit(1);
    }

    const apiLoginURL = "https://workflow-energy.onrender.com/api/auth/login";

    const usuarios = [
        {
            rol: "admin",
            email: process.env.ADMIN_USER,
            password: process.env.ADMIN_PASS,
            archivo: "adminAuth.json",
        },
        {
            rol: "supervisor",
            email: process.env.SUPERVISOR_USER,
            password: process.env.SUPERVISOR_PASS,
            archivo: "supervisorAuth.json",
        },
        {
            rol: "jefe",
            email: process.env.JEFE_USER,
            password: process.env.JEFE_PASS,
            archivo: "jefeAuth.json",
        },
        {
            rol: "empleado",
            email: process.env.EMPLEADO_USER,
            password: process.env.EMPLEADO_PASS,
            archivo: "empleadoAuth.json",
        },
    ];

    const browser = await chromium.launch();

    for (const usuario of usuarios) {
        console.log(`🔐 Iniciando sesión como ${usuario.rol} (${usuario.email})`);

        const apiRequest = await request.newContext();
        const response = await apiRequest.post(apiLoginURL, {
            data: { email: usuario.email, password: usuario.password },
        });

        if (!response.ok()) {
            console.error(`[ERROR] Falló el login de ${usuario.rol}`);
            continue;
        }

        const data = await response.json();
        const token = data?.accessToken;

        if (!token) {
            console.error(`[ERROR] No se obtuvo token para ${usuario.rol}`);
            continue;
        }

        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(baseURL);
        await page.evaluate((t) => localStorage.setItem("accessToken", t), token);

        const storagePath = path.join(__dirname, "..", "auth", usuario.archivo);
        await fs.mkdir(path.dirname(storagePath), { recursive: true });
        await context.storageState({ path: storagePath });
        await context.close();

        console.log(`✅ Archivo ${usuario.archivo} creado`);
    }

    // Crear un estado sin autenticación
    const noAuthPath = path.join(__dirname, "..", "auth", "noAuth.json");
    await fs.writeFile(noAuthPath, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    console.log("📄 noAuth.json generado correctamente");

    await browser.close();
}
