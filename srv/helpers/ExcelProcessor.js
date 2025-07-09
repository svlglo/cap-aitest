// Importa la librería XLSX. En ES Modules, para importar librerías CommonJS (como xlsx),
import * as XLSX from 'xlsx';
import { Buffer } from 'buffer';

/**
 * Procesa un archivo Excel que puede tener múltiples hojas.
 * @param {string} base64Excel El archivo Excel codificado en Base64.
 * @returns {Promise<string>} promesa que se resuelve con un String JSON.
 * @throws {Error} 
 */

export async function processExcel(base64Excel) {
    try {
        // Elimina posibles prefijos 
        const cleanBase64 = base64Excel.includes(',') ? base64Excel.split(',')[1] : base64Excel;
        const excelBuffer = Buffer.from(cleanBase64, 'base64');
        const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
        const jsonData = {}; 

        // itera sobre cada hoja presente en el libro de Excel
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];

            // convierte la hoja de trabajo actual a un array de arrays (donde cada sub-array es una fila).
            const sheetDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Si la hoja está vacía, la representamos como un array vacío en el JSON.
            if (sheetDataRaw.length === 0) {
                jsonData[sheetName] = [];
                return; // Pasa a la siguiente hoja
            }

            // La primera fila contiene los encabezados.
            const headers = sheetDataRaw[0];
            // El resto de las filas son los datos.
            const dataRows = sheetDataRaw.slice(1);

            // Transforma las filas de datos en un formato de array de objetos, usando los encabezados.
            const formattedSheetData = dataRows.map(row => {
                let rowObject = {};
                headers.forEach((header, index) => {
                    const cleanHeader = (typeof header === 'string') ? header.trim().replace(/\s+/g, '_') : `Columna_${index}`;
                    rowObject[cleanHeader] = row[index]; 
                });
                return rowObject;
            });

            // Asigna los datos formateados de la hoja actual al objeto principal JSON.
            jsonData[sheetName] = formattedSheetData;
        });

        // convierte el objeto JSON final (con datos de todas las hojas) a un String.
        return JSON.stringify(jsonData, null, 2);

    } catch (error) {
        console.error("Error al procesar el archivo Excel:", error);
        throw new Error(`Fallo al procesar el archivo Excel: ${error.message}`);
    }
}