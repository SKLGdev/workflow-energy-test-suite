import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Cargar variables del .env
dotenv.config();

// Emular __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    testDir: "./tests",
    timeout: 30 * 1000,
    retries: 2,
    reporter: [["html"], ["line"]],

    // Se ejecutan automáticamente antes y después de la suite
    globalSetup: "./tests/e2e/utils/global-setup.ts",
    globalTeardown: "./tests/e2e/utils/global-teardown.ts",

    use: {
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        headless: true,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "on-first-retry",
    },

    // Cada proyecto se ejecuta autenticado con un rol distinto
    projects: [
        {
            name: "Admin",
            use: {
                ...devices["Desktop Chrome"],
                storageState: path.join(__dirname, "tests/e2e/auth/adminAuth.json"),
            },
        },
        {
            name: "Supervisor",
            use: {
                ...devices["Desktop Chrome"],
                storageState: path.join(__dirname, "tests/e2e/auth/supervisorAuth.json"),
            },
        },
        {
            name: "Jefe",
            use: {
                ...devices["Desktop Chrome"],
                storageState: path.join(__dirname, "tests/e2e/auth/jefeAuth.json"),
            },
        },
        {
            name: "Empleado",
            use: {
                ...devices["Desktop Chrome"],
                storageState: path.join(__dirname, "tests/e2e/auth/empleadoAuth.json"),
            },
        },
        {
            name: "NoAuth",
            use: {
                ...devices["Desktop Chrome"],
                storageState: path.join(__dirname, "tests/e2e/auth/noAuth.json"),
            },
        },
    ],
});
