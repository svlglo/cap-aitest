import mammoth from 'mammoth';
/**
 * Procesa un archivo Word (DOCX) en formato Base64, extrae su texto
 * y lo retorna como un string JSON.
 * Mammoth.js está diseñado para convertir DOCX a HTML, pero podemos extraer el texto plano.
 * @param {string} base64Docx El contenido del archivo DOCX en formato Base64.
 * @returns {Promise<string>} Un string JSON con el texto extraído del DOCX.
 */
export async function processWordDocx(base64Docx) {
    if (!base64Docx || typeof base64Docx !== 'string') {
        throw new Error('El archivo DOCX es inválido o está vacío.');
    }

    // Convertir el string Base64 a un Buffer
    const docxBuffer = Buffer.from(base64Docx, 'base64');

    try {

      // Crear un Uint8Array desde el buffer
      const uint8Array = new Uint8Array(docxBuffer);

        // Crear un ArrayBuffer desde el Uint8Array
        const arrayBuffer = uint8Array.buffer;


        // mammoth.extractRawText() extrae solo el texto sin HTML
        const result = await mammoth.extractRawText({ buffer: arrayBuffer});
        const extractedText = result.value;
        const messages = result.messages; // 

        const output = {
            docContent: extractedText,
            warnings: messages.length > 0 ? messages.map(msg => msg.message) : []
        };

        return JSON.stringify(output);

    } catch (error) {
        console.error('Error al procesar el archivo DOCX:', error);
        throw new Error(`No se pudo procesar el archivo DOCX: ${error.message}`);
    }
}