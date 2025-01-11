// src/lib/agent/method/read/balance.ts

import { tokenAddresses } from "src/lib/constant";
import { StarknetAgent } from "../../starknetAgent";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "felt" }],
    outputs: [{ name: "balance", type: "Uint256" }],
    stateMutability: "view",
  },
];

export type GetOwnBalanceParams = {
  symbol: string;
};

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  try {
    const walletAddress = process.env.PUBLIC_ADDRESS;
    if (!walletAddress) {
      throw new Error("Wallet address not configured");
    }

    const agent = new StarknetAgent({
      walletPrivateKey: privateKey,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const tokenAddress = tokenAddresses[params.symbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.symbol} not supported`);
    }

    // Create contract instance
    const contract = agent.contractInteractor.createContract(
      ERC20_ABI,
      tokenAddress,
    );

    // Read balance
    const result = await agent.contractInteractor.readContract(
      contract,
      "balanceOf",
      [walletAddress],
    );

    // Parse the amount
    const decimals =
      params.symbol === "USDC" || params.symbol === "USDT" ? 6 : 18;
    const parsedBalance = agent.contractInteractor.parseTokenAmount(
      result.balance.toString(),
      decimals,
    );

    return JSON.stringify({
      status: "success",
      balance: parsedBalance,
      raw_balance: result.balance.toString(),
      decimals: decimals,
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export type GetBalanceParams = {
  walletAddress: string;
  assetSymbol: string;
};

export const getBalance = async (params: GetBalanceParams) => {
  try {
    const agent = new StarknetAgent({
      walletPrivateKey: process.env.STARKNET_PRIVATE_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const tokenAddress = tokenAddresses[params.assetSymbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.assetSymbol} not supported`);
    }

    // Create contract instance
    const contract = agent.contractInteractor.createContract(
      ERC20_ABI,
      tokenAddress,
    );

    // Read balance
    const result = await agent.contractInteractor.readContract(
      contract,
      "balanceOf",
      [params.walletAddress],
    );

    // Parse the amount
    const decimals =
      params.assetSymbol === "USDC" || params.assetSymbol === "USDT" ? 6 : 18;
    const parsedBalance = agent.contractInteractor.parseTokenAmount(
      result.balance.toString(),
      decimals,
    );

    return JSON.stringify({
      status: "success",
      balance: parsedBalance,
      raw_balance: result.balance.toString(),
      decimals: decimals,
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
