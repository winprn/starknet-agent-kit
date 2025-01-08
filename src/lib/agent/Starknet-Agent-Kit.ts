import { createAgent } from './agent.js';
import type { AgentExecutor } from 'langchain/agents';
import { getOwnBalance, GetOwnBalanceParams } from './method/balance.js';

export interface StarknetAgentConfig {
  walletPrivateKey: string;
  anthropicApiKey: string;
}

export class StarknetAgent {
  private walletPrivateKey: string;
  private AgentExecutor: AgentExecutor;
  private anthropicApiKey: string;

  constructor(config: StarknetAgentConfig) {
    this.walletPrivateKey = config.walletPrivateKey;
    this.anthropicApiKey = config.anthropicApiKey;

    if (!this.walletPrivateKey) {
      throw new Error(
        'Starknet wallet private key is required https://www.argent.xyz/argent-x',
      );
    }

    this.AgentExecutor = createAgent(this, this.anthropicApiKey);
  }

  getCredentials() {
    return {
      walletPrivateKey: this.walletPrivateKey,
      anthropicApiKey: this.anthropicApiKey,
    };
  }

  async execute(input: string) {
    const response = await this.AgentExecutor.invoke({
      input,
    });
    console.log(response);
    return response;
  }

  async getOwnBalance(params: GetOwnBalanceParams) {
    return await getOwnBalance(params, this.walletPrivateKey);
  }
}
