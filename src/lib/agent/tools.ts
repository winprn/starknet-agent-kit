import { tool } from "@langchain/core/tools";
import {
  CreateOZAccount,
  CreateArgentAccount,
} from "src/lib/agent/method/account/createAccount";
import { DeployArgentAccount } from "src/lib/agent/method/account/deployAccount";
import { getOwnBalance, getBalance } from "./method/read/balance";
import { getBlockNumber } from "./method/read/rpc/getBlockNumber";
import { getBlockTransactionCount } from "./method/read/rpc/getBlockTransactionCount";
import { getStorageAt } from "./method/read/rpc/getStorageAt";
import { getClassAt } from "./method/read/rpc/getClassAt";
import { getClassHash } from "./method/read/rpc/getClassHash";
import {
  getClassAtSchema,
  getClassHashSchema,
  getOwnBalanceSchema,
  getBalanceSchema,
  DeployArgentAccountSchema,
  getBlockTransactionCountSchema,
  getStorageAtSchema,
  swapSchema,
} from "./schema";
import { swapTokens } from "./method/swap";

// Types
type StarknetAgentInterface = {
  getCredentials: () => { walletPrivateKey: string };
};

/**
 * Wraps a function to inject the wallet private key from the agent
 */
const withWalletKey = <T>(
  fn: (params: T, privateKey: string) => Promise<any>,
  agent: StarknetAgentInterface
) => {
  return (params: T) => fn(params, agent.getCredentials().walletPrivateKey);
};

/**
 * Creates and returns balance checking tools with injected agent credentials
 */
export const createTools = (agent: StarknetAgentInterface) => [
  tool(withWalletKey(getOwnBalance, agent), {
    name: "get_own_balance",
    description: "Get the balance of an asset in your wallet",
    schema: getOwnBalanceSchema,
  }),
  tool(getBalance, {
    name: "get_balance",
    description: "Get the balance of an asset for a given wallet address",
    schema: getBalanceSchema,
  }),
  tool(CreateOZAccount, {
    name: "CreateOZAccount",
    description: "Create Open Zeppelin account",
  }),
  tool(CreateArgentAccount, {
    name: "CreateArgentAccount",
    description: "Create Account account",
  }),
  tool(DeployArgentAccount, {
    name: "DeployArgent",
    description: "Deploy a Argent Account",
    schema: DeployArgentAccountSchema,
  }),
  tool(getBlockNumber, {
    name: "get_block_number",
    description: "Get the current block number from the Starknet network",
  }),
  tool(getBlockTransactionCount, {
    name: "get_block_transaction_count",
    description: "Get the number of transactions in a specific block",
    schema: getBlockTransactionCountSchema,
  }),
  tool(getStorageAt, {
    name: "get_storage_at",
    description: "Get the storage value at a specific slot for a contract",
    schema: getStorageAtSchema,
  }),
  tool(getClassAt, {
    name: "get_class_at",
    description: "Get the class definition of a contract at a specific address",
    schema: getClassAtSchema,
  }),
  tool(getClassHash, {
    name: "get_class_hash",
    description: "Get the class hash for a contract at a specific address",
    schema: getClassHashSchema,
  }),
  tool(withWalletKey(swapTokens, agent), {
    name: "swap_tokens",
    description:
      "Swap a specified amount of one token for another token. This does not check balances; provide exact amounts.",
    schema: swapSchema,
  }),
];
