import cds from '@sap/cds';
import agente from './controller/AIAgentController.js';
import Proceso from './controller/ProcessController.js';
import Helpers from './helpers/Helpers.js';



export default cds.service.impl(async (srv) => {


    ///odata/v2/servicios/testAI?campo='testo'
    ///odata/v4/servicios/testAI(campo='genera un resumen del futbol en 100 caracteres')
    srv.on("testAI", async (req) => {

        let agee = new agente("agenteResumenFinal");

        agee.aitest(req.data.campo);

            // Responder inmediatamente
            console.log("Documento recibido exitosamente, tracking id 007");
            return { 
                message: "Documento recibido exitosamente",
                trackingId: "007" 
            };
        
    });

        srv.on("uploadDocument", async (req) => {

            const pro = new Proceso();
            const help = new Helpers();

            const header = req.data.HeaderData;
            const files = req.data.Files;

            const trackingId = help.generateTrackingId();

            Promise.resolve().then(async () => {
                await pro.procesarDocumento(header, files, trackingId);
            });

            // Responder inmediatamente
            return { 
                message: "Documento recibido exitosamente",
                trackingId: trackingId 
            };
        
    });


    srv.on('obtenerResumen', async (req) => {
        console.log(req.data.id_sociedad);
        console.log(req.data.id_documento);
        console.log(req.data.idioma_user);


        return `Resumen generado por ia : ${req.data?.id_sociedad} ${req.data?.id_documento} ${req.data?.idioma_user}`;
    
    } );
  


});