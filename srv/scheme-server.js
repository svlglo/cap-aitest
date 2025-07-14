import cds from '@sap/cds';
import AIAssistant from './controllers/AIAssistantController.js';
import Proceso from './controllers/ProcessController.js';
import Helpers from './helpers/Helper.js';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';


export default cds.service.impl(async (srv) => {


  ///odata/v2/servicios/testAI?campo='testo'
  ///odata/v4/servicios/testAI(campo='genera un resumen del futbol en 100 caracteres')
  srv.on("testAI", async (req) => {

    let agee = new AIAssistant("agentFinalSummary");

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

    const header = req.data.header;
    const files = req.data.files;

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



  srv.on('getSummary', async (req) => {

    const pro = new Proceso();
    let summary = await pro.getSummaryDocument(req.data?.company_code, req.data?.id_document, req.data?.language_user);

    if(summary !=""){

      return summary;

    }else{
      return "No summary available";
    }



  });






  srv.on('testAICore', async (req) => {

    // Orchestration configuration with Gemini model
    const orchestrationConfig = {
      llm: {
        model_name: 'gemini-2.5-flash'
      }
    };

    // Deployment configuration with custom resource group
    const deploymentConfig = {
      resourceGroup: 'default'
    };

    // Destination configuration
    const destinationConfig = {
      destinationName: 'AICORE-DESTINATION'
    };

    // Initialize the OrchestrationClient with proper parameters
    const orchestrationClient = new OrchestrationClient(
      orchestrationConfig,
      deploymentConfig,
      destinationConfig
    );

    try {
      // Use chatCompletion method with proper message structure
      const response = await orchestrationClient.chatCompletion({
        messages: [
          { role: 'user', content: 'Hello World! Why is this phrase so famous?' }
        ]
      });

      // Log response details using the convenience methods
      console.log('Content:', response.getContent());
      console.log('Finish Reason:', response.getFinishReason());
      console.log('Token Usage:', JSON.stringify(response.getTokenUsage()));

      return {
        content: response.getContent(),
        finishReason: response.getFinishReason(),
        tokenUsage: response.getTokenUsage()
      };

    } catch (error) {
      console.error('AI Core connection test failed:', error);
      throw error;
    }
  });


  
  srv.on("testWord", async (req) => {

    const pro = new Proceso();
    const help = new Helpers();

    const header = req.data.header;
    const files = req.data.files;

    const trackingId = help.generateTrackingId();

    return await pro.procesarTestWord(header, files, trackingId);



  });



});