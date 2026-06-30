import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { ocrEnv } from '@repo/env/ocr';

export class OcrProvider {
  private client: BedrockRuntimeClient;

  private static MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

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

    const data = JSON.parse(response.body.toString());

    const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));

    return data;
  };
}
