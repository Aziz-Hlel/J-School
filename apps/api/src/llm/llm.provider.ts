import ENV from '@/config/env';
import { BedrockRuntimeClient, ConverseCommand, Message } from '@aws-sdk/client-bedrock-runtime';

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt: string;
  modelId: string;
}

export class LlmProvider {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: ENV.AWS_BEDROCK_REGION,
      credentials: {
        accessKeyId: ENV.AWS_BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: ENV.AWS_BEDROCK_SECRET_ACCESS_KEY,
      },
    });
  }

  async generateChatCompletion(conversationHistory: any[], options: CompletionOptions): Promise<string> {
    // 1. Structure the system prompt exactly how the Converse API expects it
    const systemPromptConfig = options.systemPrompt ? [{ text: options.systemPrompt }] : undefined;

    // 2. Map your internal history to Bedrock's standardized message schema
    // (ConverseCommand expects content to be an array of objects)
    const standardizedMessages: Message[] = conversationHistory
      .filter((m) => m.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: [{ text: msg.content }],
      }));

    // 3. Fire the unified Converse Command
    const command = new ConverseCommand({
      modelId: options.modelId, // Works instantly with 'eu.anthropic.claude-...' OR 'google.gemma-...'
      messages: standardizedMessages,
      system: systemPromptConfig,
      inferenceConfig: {
        maxTokens: options.maxTokens ?? 2000,
        temperature: options.temperature ?? 0.7,
      },
    });

    const response = await this.client.send(command);

    // 4. Extract the response text using the unified output envelope
    // (No more checking for .generation or .content[0].text depending on the model vendor!)
    return response.output?.message?.content?.[0]?.text || '';
  }
}

export const globalLlmProvider = new LlmProvider();
