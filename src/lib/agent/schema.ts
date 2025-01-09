import { z } from "zod";

// Schema definitions
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

export const getStorageAtSchema = z.object({
  contractAddress: z
    .string()
    .describe("The contract address to get storage from"),
  key: z.string().describe("The storage slot key to query"),
  blockIdentifier: z
    .string()
    .optional()
    .describe("Block identifier (optional, defaults to 'latest')"),
});

export const getBlockTransactionCountSchema = z.object({
  blockIdentifier: z
    .string()
    .optional()
    .describe("Block identifier (optional, defaults to 'latest')"),
});

export const getClassAtSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address to get the class from"),
    blockIdentifier: z
      .union([z.literal("latest"), z.string().regex(/^[0-9]+$/), z.number()])
      .optional()
      .describe("Block identifier (optional, defaults to 'latest')"),
  })
  .strict();

export const getClassHashSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address to get the class hash from"),
    blockIdentifier: z
      .union([
        z.literal("latest"),
        z.number(),
        z.string().regex(/^0x[0-9a-fA-F]+$/),
      ])
      .optional()
      .default("latest")
      .describe("Block identifier (defaults to 'latest')"),
  })
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

// Types for function parameters that match the schemas
export type GetClassAtParams = z.infer<typeof getClassAtSchema>;
export type GetClassHashParams = z.infer<typeof getClassHashSchema>;
