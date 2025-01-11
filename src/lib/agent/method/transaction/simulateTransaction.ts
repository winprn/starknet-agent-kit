// method/transaction/simulateTransaction.ts
import { Account, Call, TransactionType } from "starknet";
import { rpcProvider } from "../../starknetAgent";
import { todo } from "node:test";

export type SimulateTransactionParams = {
  calls: Call[];
};

export const simulateTransaction = async (
  params: SimulateTransactionParams,
  privateKey: string,
) => {
  todo();
};
