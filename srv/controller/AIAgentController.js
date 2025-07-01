import cds from '@sap/cds';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIAgent {
    constructor(tipoAgente) {

      const promptPath = path.join(__dirname, '../agentes/prompt.json');
      const promptData = JSON.parse(fs.readFileSync(promptPath, 'utf8'));

      this.promptAgente = promptData[tipoAgente]; // Acceder directamente usando el tipoAgente


      //cargar settings agente
      const llmName = new AzureOpenAiChatClient({ modelName: promptData.modelName , destinationName: 'SAP_AI_CORE'});
      
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ['system', this.promptAgente.prompt],
        ['user', '{text}']
      ]);

      const parser = new StringOutputParser();
      this.agente = promptTemplate.pipe(llmName).pipe(parser);
    }


    async generarResumen(texto){

      let respuesta = await this.agente.invoke({
        key_words: this.promptAgente.keyWords,
        text: texto
       });
       

       return respuesta;

    }

 
    async aitest(texto='genera un resumen de Globant') {


        try {

            const chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4.1-nano', destinationName: 'SAP_AI_CORE'});

            const response = await chatClient.invoke(texto);
            console.log(response.content);

          
        } catch (error) {
          console.log(error);
        }
           
    

       
    
        }
           

}

export default AIAgent;