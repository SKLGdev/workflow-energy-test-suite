import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function globalTeardown() {
  const authDir = path.join(__dirname, '..', 'auth')

  try {
    const archivos = await fs.readdir(authDir)
    await Promise.all(archivos.map((a) => fs.unlink(path.join(authDir, a))))
    console.warn(`🧹 Limpieza completa: ${archivos.length} archivos de auth eliminados.`)
  } catch {
    console.warn('[INFO] No se encontraron archivos de auth para eliminar.')
  }
}
