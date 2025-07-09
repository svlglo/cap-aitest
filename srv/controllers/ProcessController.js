import cds from '@sap/cds';
import AIAssistant from './AIAssistantController.js';
import Helper from '../helpers/Helper.js';
import * as ExcelProcessor from '../helpers/ExcelProcessor.js';
//const { processExcelBase64ToJson } = require('../utils/excelProcessor');

const entities = cds.entities("meli.aitest.db");

class ProcessController {
    constructor() {
        this.helper = new Helper();

    }
    

    async procesarDocumento(header, files, trackingId) {

        try {

            const { Document } = entities;
            let bContinuar = true;
            let oDocument;

            try {

                const query = SELECT.one.from(Document).where({ idSap: header?.idSap});
                oDocument = await cds.run(query);
                    if(!oDocument) {
                        bContinuar = true;
                        const qInsert = INSERT.into(Document).entries(header);
                        oDocument = await cds.run(qInsert);

                        console.log("Registro insertado");

                        }else{
                        console.log("Ya existe por lo que no se debe reprocesar");
                    }
                
                } catch (error) {
                    console.error("Error al consultar el documento:", error);
                }

            //si el documento no se ha procesado se debe procesar para obtener el resumen
            //console.log(oDocument);

            if(bContinuar){

                let aSummaries = [];
                for (const file of files) {
                  
                    //segun tipo de documento se debe instanciar asistente y processor
                    switch (file.documentType) {
                        case "excel":
                            this.AIAssistant = new AIAssistant("assistantExcel");
                            let jContenido = await ExcelProcessor.processExcel(file.content);
                            let resFile = await this.AIAssistant.generateSummaryFile(jContenido);

                            aSummaries.push(resFile);
                            console.log(resFile);

                            console.log(JSON.stringify(resFile))
                            
                            break;
                        case "word":
                            
                            break;
                        default:
                            //solo debemos guardar el registro pero indicando que no se debe procesar.
                            break;
                    }

                    
                    console.log(`Procesando archivo: ${file.fileName}`);
                }

                //generar resumen final
                //tipo de agente por documento
             /*   this.AIAssistant = new AIAssistant("agentFinalSummary");
                let finalSummary = await this.AIAssistant.generateSummary(JSON.stringify(aSummaries));

                //actualizar registro de document
                const updateQuery = UPDATE(Document).set({ summary: finalSummary }).where({ idSap: header?.idSap }); 
                await cds.run(updateQuery);
                */





            }



   

            //considerar prompt por tipo de anexo ( word, excel, pdf, etc)


 

            //considerar generar resumen final 

            //lang


            // this.AIAgent = new AIAgent("agenteOrdenCompra");
            //let file = "Este es un ejemplo para que generes un resumen";
            //let re = await this.AIAgent.generarResumen(file);
            //console.log(re);


             //1.validar si el documento ya fue procesado o no:
             
             /*const query = SELECT.one.from(Document).where({ idSap: header?.idSap});
                let oDocument = await cds.run(query);
                if(!oDocument) {
                    bContinuar = true;
                    //registrar en tabla hana
                    const qInsert = INSERT.into(Document).entries(header);
                    oDocument = await cds.run(qInsert);

                  }else{
                    console.log("Ya existe por lo que no se debe reprocesar");
                  }
                    */
           
                  /*
            //recorrer files para procesar cada archivo por separado.
            if(bContinuar){
                //se debe instanciar agente segun tipo documento
                const typeAgent = this.helper.getTypeAgent(header.documentType);
                this.AIAgent = new AIAgent(typeAgent);

                let aResumeFiles = [];
                for (const file of files) {
                    // Procesar cada archivo
                    

                    //obtener texto del archivo por lo que se debe consumir controlador segun tipo de archivo.
                    let resFile = await this.AIAgent.generateSummaryFile(file);
                    aResumeFiles.push(resFile);
                    console.log(`Procesando archivo: ${file.name}`);
                }

                //con todos los resumenes se debe generar resumen final
                this.AIResumenAgent = new AIAgent(agentFinalSummary);
                let resFinal = this.AIResumenAgent.generateSummary(aResumeFiles);
             

            }
               */

            //tendremos que recibir el archivo? Preguntar en que formato viene, base64? o como un file.

            //ver que tipo de agente se debe instanciar
            //ver que tipo de archivo es y que controlador usar para leer contenido
        
            

            //ejecutar controlador de agente para pedir resumen
            //despues de loop, instanciar controlador para ejecutar resumen final y guardar en registro en tabla hana


           // this.AIAgent = new AIAgent("agenteOrdenCompra");
            //let file = "Este es un ejemplo para que generes un resumen";
            //let re = await this.AIAgent.generarResumen(file);
            //console.log(re);
            
        } catch (error) {

            console.error("Error processing the file:", error);
            
        }
     
    }



}

export default ProcessController;
