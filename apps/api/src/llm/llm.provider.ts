import ENV from '@/config/env';
import { isDev } from '@/config/env/NodeEnvs';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

export class LlmProvider {
  private client: BedrockRuntimeClient;

  constructor() {
    if (isDev(ENV)) {
      this.client = new BedrockRuntimeClient({
        region: ENV.AWS_BEDROCK_REGION,
        credentials: {
          accessKeyId: ENV.AWS_BEDROCK_ACCESS_KEY_ID,
          secretAccessKey: ENV.AWS_BEDROCK_SECRET_ACCESS_KEY,
        },
      });
    }
  }
}
