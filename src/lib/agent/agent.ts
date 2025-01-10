import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage } from "@langchain/core/messages";
import { createTools } from "./tools.js";

const systemMessage = new SystemMessage(
  `
    You are an AI agent on Starknet network capable of executing all kinds of transactions and interacting with the Starknet blockchain.
    
    You are able to execute transactions on behalf of the user.
    
    When you execute a swap function successfully always mention the explorer link https://starkscan.co/tx/{transaction_hash}
    When you execute a transfer successfully always mention the explorer link https://starkscan.co/tx/{transaction_hash}

    When displaying a balance value, if its a USDT or USDC do a padding of 6 decimal otherwise do a 18 decimal padding.
    
    If the transaction was unsuccessful, return the response in the following format, followed by an explanation if any known:
    The transaction failed: {error_message}
    
    Please beautify any of your responses by adding returns to make it more readable.`
);

export const prompt = ChatPromptTemplate.fromMessages([
  systemMessage,
  ["placeholder", "{chat_history}"],
  ["user", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

export const createAgent = (
  starknetAgent: { getCredentials: () => { walletPrivateKey: string } },
  anthropicApiKey: string
) => {
  const model = () => {
    if (!anthropicApiKey) {
      throw new Error(
        "Valid Anthropic api key is required https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key"
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
