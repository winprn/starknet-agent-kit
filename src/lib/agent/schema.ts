import { z } from "zod";

// Schema definitions
export const TransferERC20schema = z.object({
  recipient_address: z.string().describe("The recipient public address"),
  amount: z.string().describe("The amount of erc20 token that will be send"),
  symbol: z.string().describe("The symbol of the erc20 token"),
});

export const blockIdSchema = z.object({
  blockId: z.union([
    z
      .string()
      .describe(
        "The block identifier. Can be 'latest', 'pending', or a block hash.",
      ),
    z.number().describe("A block number."),
  ]),
});

export const contractAddressSchema = z.object({
  contractAddress: z.string().describe("The address of the contract"),
});

export const transactionHashSchema = z.object({
  transactionHash: z
    .string()
    .describe("The hash of the requested transaction."),
});

export const DeployOZAccountSchema = z.object({
  publicKey: z.string().describe("The public key to deploy the OZ Account"),
  privateKey: z.string().describe("The private key to deploy the OZ Account"),
});

export const getOwnBalanceSchema = z.object({
  symbol: z
    .string()
    .describe("The asset symbol to get the balance of. eg. USDC, ETH"),
});

export const getBalanceSchema = z.object({
  walletAddress: z
    .string()
    .describe("The wallet address to get the balance of"),
  assetSymbol: z
    .string()
    .describe("The asset symbol to get the balance of. eg. USDC, ETH"),
});

export const DeployArgentAccountSchema = z.object({
  publicKeyAX: z
    .string()
    .describe("The public key to deploy the Argent Account"),
  privateKeyAX: z
    .string()
    .describe("The private key to deploy the Argent Account"),
});

export const blockIdAndContractAddressSchema = blockIdSchema
  .merge(contractAddressSchema)
  .strict();

export const swapSchema = z.object({
  sellTokenSymbol: z
    .string()
    .describe("Symbol of the token to sell (e.g., 'ETH', 'USDC')"),
  buyTokenSymbol: z
    .string()
    .describe("Symbol of the token to buy (e.g., 'ETH', 'USDC')"),
  sellAmount: z.number().positive().describe("Amount of tokens to sell"),
});

export const getStorageAtSchema = blockIdAndContractAddressSchema.merge(
  z.object({
    key: z
      .string()
      .describe("The key to the storage value for the given contract"),
  }),
);

export const getTransactionByBlockIdAndIndexSchema = blockIdSchema.merge(
  z.object({
    transactionIndex: z
      .number()
      .int()
      .nonnegative()
      .describe("The index of the transaction within the block."),
  }),
);

// Types for function parameters that match the schemas
export type GetStorageParams = z.infer<typeof getStorageAtSchema>;
export type BlockIdParams = z.infer<typeof blockIdSchema>;
export type TransactionHashParams = z.infer<typeof transactionHashSchema>;
export type BlockIdAndContractAddressParams = z.infer<
  typeof blockIdAndContractAddressSchema
>;
export type GetTransactionByBlockIdAndIndexParams = z.infer<
  typeof getTransactionByBlockIdAndIndexSchema
>;
