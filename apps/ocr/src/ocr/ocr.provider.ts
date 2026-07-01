import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { ocrEnv } from '@repo/env/ocr';

export class OcrProvider {
  private client: BedrockRuntimeClient;

  private static MODEL_ID = 'eu.anthropic.claude-sonnet-4-6';

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: ocrEnv.AWS_BEDROCK_REGION,
      credentials: {
        accessKeyId: ocrEnv.AWS_BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: ocrEnv.AWS_BEDROCK_SECRET_ACCESS_KEY,
      },
    });
  }

  invokeOcr = async ({ body }: { body: any }) => {
    const invokeCommand = new InvokeModelCommand({
      modelId: OcrProvider.MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });
    const response = await this.client.send(invokeCommand);

    const rawResponseBody = Buffer.from(response.body).toString('utf-8');
    const parsedResponse = JSON.parse(rawResponseBody);

    // 2. Extract Claude's actual text output from the Bedrock payload wrapper
    // (For Claude on Bedrock, it usually lives under completion OR content depending on your SDK flavor)
    let aiTextText = parsedResponse.completion || parsedResponse.content?.[0]?.text || '';

    if (!aiTextText) {
      throw new Error('Could not extract text content from Bedrock response envelope.');
    }
    console.log('ai response : ', aiTextText);
    // // 3. Clean out markdown fences if Claude ignored your system instructions
    // const cleanedJsonString = aiTextText
    //   .replace(/^```json\s*/i, '') // Removes leading ```json
    //   .replace(/^```\s*/i, '') // Removes leading ```
    //   .replace(/\s*```$/, '') // Removes trailing ```
    //   .trim();

    // // 4. Safely parse the final string into your structured JSON object
    // try {
    //   return JSON.parse(cleanedJsonString);
    // } catch (error) {
    //   console.error('Failed to parse cleaned LLM response. Raw text was:', aiTextText);
    //   throw error;
    // }
  };
}
