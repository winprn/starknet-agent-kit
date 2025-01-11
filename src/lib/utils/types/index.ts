import { ProviderInterface } from "starknet";

export interface AccountDetails {
  address: string;
  privateKey: string;
  publicKey: string;
  deployStatus: boolean;
}

export interface TransactionResult {
  status: "success" | "failure";
  transactionHash?: string;
  error?: string;
}

export interface BaseUtilityClass {
  provider: ProviderInterface;
}

export interface ContractDeployResult {
  transactionHash: string;
  contractAddress: string | string[];
}

export interface TokenAmount {
  amount: string;
  decimals: number;
}
