/**
 * Genera un string aleatorio de la longitud especificada
 * @param cantidad - Longitud del string a generar
 * @returns String aleatorio compuesto por letras y números
 */
export function generarStringAleatorio(cantidad: number): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let resultado = "";

    for (let i = 0; i < cantidad; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return resultado;
}

/**
 * Genera un ID aleatorio numérico de la longitud especificada
 * @param cantidad - Longitud del ID a generar
 * @returns ID numérico aleatorio como string
 */
export function generarIdAleatorio(cantidad: number): string {
    let resultado = "";

    // El primer dígito no puede ser 0 para evitar IDs que empiecen con 0
    resultado += Math.floor(Math.random() * 9) + 1;

    // Generar el resto de los dígitos
    for (let i = 1; i < cantidad; i++) {
        resultado += Math.floor(Math.random() * 10);
    }

    return resultado;
}

