import cds from '@sap/cds';
import agente from './controller/AIAgentController.js';

export default cds.service.impl(async (srv) => {


    srv.on("uploadDocumento", async (req) => {


        let agee = new agente("agenteResumenFinal");
        agee.aitest();

            // Responder inmediatamente
            return { 
                message: "Documento recibido exitosamente",
                trackingId: "007" 
            };
        
    });


});