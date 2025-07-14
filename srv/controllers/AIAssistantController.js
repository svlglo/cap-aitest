import cds from '@sap/cds';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destinationConfig = { destinationName: 'aicore-destination_v2_MELI', deploymentId: 'dcced27a0da18755'} ;
const modelName = "gpt-4.1-nano";


class AIAssistant {
    constructor(typeAssistant) {  
      try {
        let promptPath, promptData;
          //get prompt 
          if(typeAssistant == "excel"){
             promptPath = path.join(__dirname, '../assistant/prompt_excel.txt');
             promptData = fs.readFileSync(promptPath, 'utf8');
          }

          if(typeAssistant == "word" || typeAssistant == "pdf" ){
            promptPath = path.join(__dirname, '../assistant/prompt_word_pdf.txt');
            promptData = fs.readFileSync(promptPath, 'utf8');
          }

          if(typeAssistant == "images"){
            promptPath = path.join(__dirname, '../assistant/prompt_images.txt');
            promptData = fs.readFileSync(promptPath, 'utf8');
          }

          if(typeAssistant == "finalSummary"){
            promptPath = path.join(__dirname, '../assistant/prompt_final.txt');
            promptData = fs.readFileSync(promptPath, 'utf8');
         }

         if(typeAssistant == "translate"){
          promptPath = path.join(__dirname, '../assistant/prompt_translate.txt');
          promptData = fs.readFileSync(promptPath, 'utf8');
        }

         
          
          this.promptAssistant = promptData; 
          //settings agent
          const llmName = new AzureOpenAiChatClient(modelName, destinationConfig);   
          const promptTemplate = ChatPromptTemplate.fromMessages([
            ['system', this.promptAssistant],
            ['user', '{text}']
          ]);
          const parser = new StringOutputParser();
          this.assistent = promptTemplate.pipe(llmName).pipe(parser);
        
      } catch (error) {
        console.error('Error initializing AIAgent:', error);
      }

    }

    async generateSummaryFile(text){

      try {
        
        let response = await this.assistent.invoke({
          text: text
         });
         return response;
      } catch (error) {
        
        console.error('Error generating summary file:', error);
      }

    }

    async generateSummary(ResumeFiles){
      let response = await this.assistent.invoke({
        text: ResumeFiles
       });
       return response;
    }

    async generateTranslate(text, language_user){
      let response = await this.assistent.invoke({
        text: text,
        langu: language_user
       });
       return response;
    }

    async aitest() {
      let llmChain;
        try {
            const chatClient = new AzureOpenAiChatClient(modelName, destinationConfig);           
            const response = await chatClient.invoke("What's the capital of France?");
            console.log(response.content);         
        } catch (error) {
          console.log(error);
        }   
    }

    
}

export default AIAssistant;
