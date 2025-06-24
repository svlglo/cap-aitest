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


    srv.on('obtenerResumen', async (req) => {
        console.log(req.data.id_sociedad);
        console.log(req.data.id_documento);
        console.log(req.data.idioma_user);
       return "Resumen generado por IA";
    
    } );
  


});