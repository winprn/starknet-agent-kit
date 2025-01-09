import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { ChatAnthropic } from '@langchain/anthropic';
import { SystemMessage } from '@langchain/core/messages';
import { createTools } from './tools.js';

interface Credentials {
  walletPrivateKey: string;
}

const systemMessage = new SystemMessage(
    `Forget the previous prompt !
    You are an AI agent on Starknet network capable of executing all kinds of transactions and interacting with the Starknet blockchain.
    
    You are able to execute transactions on behalf of the user.
    
    If the transaction was successful, return the response in the following format:
    The transaction was successful. The explorer link is: https://starkscan.co/tx/0x{transaction_hash}
    If the read function get_own_balance is succesful return the response in the following format :
    Your balance = {balance}. And the balance value if its a USDT or USDC do a padding of 6 decimal otherwise do a 18 decimal padding
    When you use CreateOZAccount or CreateArgentAccount if is succesful, return the response in the following format :
    Your {wallet} account has been created with the public key : {new_account_public_key} and private_key{new_account_private_key}.
    If the transaction was unsuccessful, return the response in the following format, followed by an explanation if any known:
    The transaction failed: {error_message}`
  );

  export const prompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    ['placeholder', '{chat_history}'],
    ['user', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);
  


  export const createAgent = (
    starknetAgent: { getCredentials: () => { walletPrivateKey: string } },
    anthropicApiKey: string,
  ) => {
    const model = () => {
        if (!anthropicApiKey) {
            throw new Error('Valid Anthropic api key is required https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key')
        }
        return new ChatAnthropic({
            modelName: "claude-3-5-sonnet-latest",
            anthropicApiKey: anthropicApiKey,
        });
    }
    const modelselected = model();
    console.log(anthropicApiKey);
    if (!modelselected) {
        throw new Error('Error initializing model');
    }

    const tools = createTools(starknetAgent);

    const agent = createToolCallingAgent({
        llm : modelselected,
        tools,
        prompt,
    });

    return new AgentExecutor({
        agent,
        tools,
    });
  };

