import { Request, Service } from '@sap/cds';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export default class AIService {

    async aitest(req: any) {
        // Initialize the client
        //const chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
        let chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4.1-nano' });
        //const chatClient = new AzureOpenAiChatClient({ modelName: 'amazon--nova-micro' });
        

        // Create a prompt template
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ['system', 'Answer the following in {language}:'],
            ['user', '{text}']
        ]);

        console.log('reaching this point');

        // Create an output parser
        let parser = new StringOutputParser();

        // Chain together template, client and parser
        const llmChain = promptTemplate.pipe(chatClient).pipe(parser);

        // Invoke the chain
        return await llmChain.invoke({
            language: 'Spanish',
            text: 'Are you aware about your context window size?'
        });

    }
}