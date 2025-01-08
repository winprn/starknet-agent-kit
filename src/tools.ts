import { Tool, tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getBalance, getOwnBalance } from './Method/read/balance.js'
import { CreateOZAccount,CreateArgentAccount } from './Method/Account/CreateAccount.js';
import { DeployOZAccount,DeployArgentAccount } from './Method/Account/DeployAccount.js';

// Types
type StarknetAgentInterface = {
  getCredentials: () => { walletPrivateKey: string };
};

/**
 * Wraps a function to inject the wallet private key from the agent
 */
const withWalletKey = <T>(
  fn: (params: T, privateKey: string) => Promise<any>,
  agent: StarknetAgentInterface,
) => {
  return (params: T) => fn(params, agent.getCredentials().walletPrivateKey);
};

// Schema definitions
const getOwnBalanceSchema = z.object({
  symbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC, ETH'),
});

const getBalanceSchema = z.object({
  walletAddress: z
    .string()
    .describe('The wallet address to get the balance of'),
  assetSymbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC, ETH'),
});

const DeployArgentAccountSchema = z.object({
  publicKeyAX : z
    .string()
    .describe('The public key to deploy the Argent Account'),
  privateKeyAX : z
    .string()
    .describe('The private key to deploy the Argent Account'),
});
/**
 * Creates and returns balance checking tools with injected agent credentials
 */
export const createTools = (agent: StarknetAgentInterface) => [
  tool(withWalletKey(getOwnBalance, agent), {
    name: 'get_own_balance',
    description: 'Get the balance of an asset in your wallet',
    schema: getOwnBalanceSchema,
  }),
  tool(getBalance, {
    name: 'get_balance',
    description: 'Get the balance of an asset for a given wallet address',
    schema: getBalanceSchema,
  }),
  tool(CreateOZAccount, {
    name : 'CreateOZAccount',
    description : 'Create Open Zeppelin account',
  }),
  tool(CreateArgentAccount, {
    name : 'CreateArgentAccount',
    description : 'Create Account account',
  }),
  tool(DeployArgentAccount,{
    name : 'DeployArgent',
    description : "Deploy a Argent Account",
    schema : DeployArgentAccountSchema,
  })
];