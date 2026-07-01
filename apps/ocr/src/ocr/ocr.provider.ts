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

    try {
      const jsonRes = JSON.parse(aiTextText);
      return jsonRes;
    } catch (error) {
      console.log('failed to json parse llm response : ', aiTextText);
      throw error;
    }
  };
}
