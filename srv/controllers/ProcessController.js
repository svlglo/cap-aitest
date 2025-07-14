import cds from '@sap/cds';
import AIAssistant from './AIAssistantController.js';
import Helper from '../helpers/Helper.js';
import * as ExcelProcessor from '../helpers/ExcelProcessor.js';
import * as WordPDFProcessor from '../helpers/WordProcessor.js';
//const { processExcelBase64ToJson } = require('../utils/excelProcessor');

const entities = cds.entities("meli.aitest.db");

class ProcessController {
    constructor() {
        this.helper = new Helper();

    }

    async insertFile(oDocument, oFile, summary, log_report) {

        const { File } = entities;

        let iFile = {};
        iFile.idSap = oDocument.idSap;
        iFile.document = oDocument;
        iFile.fileName = oFile.fileName;
        iFile.mimeType = oFile.mimeType;
        iFile.summary = summary;
        iFile.logReport = log_report;


        let qInsert = INSERT.into(File).entries(iFile);
        return await cds.run(qInsert);

    }

    
    async procesarTestWord(header, files, trackingId) {
        return await WordPDFProcessor.processWordDocx(files[0].content);

    }

    async procesarDocumento(header, files, trackingId) {

        try {

            const { Document } = entities;
            let bContinuar = true;
            let oDocument;

            try {

                const query = SELECT.one.from(Document).where({ idSap: header.idSap });
                oDocument = await cds.run(query);
                if (!oDocument) {
                    bContinuar = true;
                    const qInsert = INSERT.into(Document).entries(header);
                    await cds.run(qInsert);
                    oDocument = await cds.run(SELECT.one.from(Document).where({ idSap: header.idSap }));

                    console.log("Registro insertado");
                    console.log(oDocument);

                } else {
                    console.log("Ya existe por lo que no se debe reprocesar");
                }

            } catch (error) {
                console.error("Error al consultar el documento:", error);
            }

            //si el documento no se ha procesado se debe procesar para obtener el resumen
            //console.log(oDocument);

            if(bContinuar) {

                let aSummaries = [];
                let iCantProcesados = 0;
                let oFile = {};
                for (const file of files) {
                    console.log(`Procesando archivo: ${file.fileName}`);
                    //segun tipo de documento se debe instanciar asistente y processor
                    switch (file.documentType) {
                        case "excel":
                            this.AIAssistant = new AIAssistant("excel");
                            let jContenido = await ExcelProcessor.processExcel(file.content);
                            let resFile = await this.AIAssistant.generateSummaryFile(jContenido);

                            console.log("contenido EXCEL");
                            console.log(jContenido);

                            aSummaries.push(resFile);
                            await this.insertFile(oDocument, file, resFile, "File processed successfully.");
                            iCantProcesados++;

                            break;
                        case "word":

                            this.AIAssistant = new AIAssistant("word");
                            let wordContent = await WordPDFProcessor.processWordDocx(file.content);
                            let resWord = await this.AIAssistant.generateSummaryFile(wordContent);

                            aSummaries.push(resWord);
                            console.log("contenido WORD");
                            console.log(wordContent);

                            //console.log(JSON.stringify(resWord))

                            await this.insertFile(oDocument, file, resWord, "File processed successfully.");
                            iCantProcesados++;

                            break;
                        case "pdf":

                            this.AIAssistant = new AIAssistant("pdf");
                            let pdfContent = await WordPDFProcessor.processWordDocx(file.content);
                            let resPdf = await this.AIAssistant.generateSummaryFile(pdfContent);

                            aSummaries.push(resPdf);
                          //  console.log(resPdf);

                            console.log(JSON.stringify(resPdf))

                            await this.insertFile(oDocument, file, resPdf, "File processed successfully.");
                            iCantProcesados++;

                            break;
                        case "images":

                            this.AIAssistant = new AIAssistant("images");
                            let resImage = await this.AIAssistant.generateSummaryFile(file.content);

                            aSummaries.push(resImage);
                          //  console.log(resImage);

                           // console.log(JSON.stringify(resImage))

                            await this.insertFile(oDocument, file, resImage, "File processed successfully.");
                            iCantProcesados++;

                            break;
                        default:
                            //solo debemos guardar el registro pero indicando que no se debe procesar.
                            await this.insertFile(oDocument, file, "", "The document type is not configured for processing.");
                            break;
                    }


         
                }

                //generar resumen final
                //tipo de agente por documento

                console.log("REsumen final con los siguientes resumenes");
                console.log(JSON.stringify(aSummaries));
                this.AIAssistant = new AIAssistant("finalSummary");
                let finalSummary = await this.AIAssistant.generateSummary(aSummaries);
                let sSummary = `El documento contiene cantidad de anexos ${iCantProcesados} anexos con la siguiente información: ${finalSummary}. Para más información puede consultar los archivos adjuntos en Central Inbox`;

       

                //actualizar registro de document
                const updateQuery = UPDATE(Document).set({ summary: sSummary }).where({ idSap: oDocument.idSap });
                await cds.run(updateQuery);
                console.log("Actualizado");



            }





        } catch (error) {

            console.error("Error processing the file:", error);

        }

    }

    async getSummaryDocument(company_code, id_document, language_user) {

        try {
            const { Document } = entities;
            const query = SELECT.one
                .from(Document)
                .columns(['summary'])
                .where({
                    idSap: id_document,
                    companyCode: company_code
                });

            const oDocument = await cds.run(query);

            console.log(oDocument);

            if(oDocument) {

                if(language_user != "ES"){
                    this.AIAssistant = new AIAssistant("translate");
                    let translateText = await this.AIAssistant.generateTranslate(oDocument.summary, language_user);
                    return translateText;
                }else{
                    return oDocument.summary;
                }
       

               


            } else {
                return "";
            }


        } catch (error) {
            console.error("Error al consultar el documento:", error);
            throw error;
        }


    }



}

export default ProcessController;
