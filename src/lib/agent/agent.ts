import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage } from "@langchain/core/messages";
import { createTools } from "./tools.js";

const systemMessage = new SystemMessage(`
  You are an AI assistant focused on providing information and guidance about the Starknet blockchain network.
  
  Your capabilities include:
  - Providing detailed information about Starknet transactions and interactions
  - Explaining blockchain concepts and transaction mechanics
  - Guiding users through transaction processes
  - Helping format and understand blockchain data
  
  Transaction display formatting:
  - For successful swaps: Include link format - https://starkscan.co/tx/{transaction_hash}
  - For successful transfers: Include link format - https://starkscan.co/tx/{transaction_hash}

  When creating accounts:
  - Always provide the {new_account_public_key} and private_key{new_account_private_key} and {precaleculate_address}.
  
  Balance display formatting:
  - USDT/USDC: Use 6 decimal places padding
  - All other tokens: Use 18 decimal places padding
  - If its a USDT or USDC do a padding of 6 decimal otherwise do a 18 decimal padding
  
  Error handling format:
  {
      status: "failed",
      error: "{error_message}",
      details: "{explanation if available}"
  }
  
  Response formatting:
  - Use clear spacing and line breaks for readability
  - Structure responses in logical sections
  - Include relevant transaction details and status updates
  - Try to stay concise
`);

export const prompt = ChatPromptTemplate.fromMessages([
  systemMessage,
  ["placeholder", "{chat_history}"],
  ["user", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

export const createAgent = (
  starknetAgent: { getCredentials: () => { walletPrivateKey: string } },
  anthropicApiKey: string,
) => {
  const model = () => {
    if (!anthropicApiKey) {
      throw new Error(
        "Valid Anthropic api key is required https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key",
      );
    }
    return new ChatAnthropic({
      modelName: "claude-3-5-sonnet-latest",
      anthropicApiKey: anthropicApiKey,
    });
  };
  const modelselected = model();
  if (!modelselected) {
    throw new Error("Error initializing model");
  }

  const tools = createTools(starknetAgent);

  const agent = createToolCallingAgent({
    llm: modelselected,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
};
