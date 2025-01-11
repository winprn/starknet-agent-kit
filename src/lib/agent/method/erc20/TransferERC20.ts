import { RPC_URL, tokenAddresses } from "src/lib/constant";
import { RpcProvider, Account, uint256 } from "starknet";
import { config } from "dotenv";

config();

/*
  const abiERC20 = [
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ name: "account", type: "felt" }],
      outputs: [{ name: "balance", type: "Uint256" }],
      stateMutability: "view",
    },
    {
      name: "transfer",
      type: "function",
      inputs: [
        { name: "recipient", type: "felt" },
        { name: "amount", type: "Uint256" },
      ],
      outputs: [{ name: "success", type: "felt" }],
      stateMutability: "external",
    },
  ];
*/
const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type TransferERC20Params = {
  recipient_address: string;
  amount: string;
  symbol: string;
};

export const TransferERC20 = async (params: TransferERC20Params) => {
  try {
    const privateKey = process.env.STARKNET_PRIVATE_KEY;
    const accountAddress = process.env.PUBLIC_ADDRESS;

    if (!privateKey || !accountAddress) {
      throw new Error(
        "StarknetPrivateKey or PublicKey is not set on your .env file !"
      );
    }

    const account = new Account(provider, accountAddress, privateKey);
    //Need more test for being sure
    const amount = params.amount; // ex: "0.0001"
    const decimals = 18;
    const [whole, fraction = ""] = amount.split(".");
    const paddedFraction = fraction.padEnd(decimals, "0");
    const amountInWei = whole + paddedFraction;

    const tokenAddress = tokenAddresses[params.symbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.symbol} not supported`);
    }
    const amountUint256 = uint256.bnToUint256(amountInWei);
    const result = await account.execute({
      contractAddress: tokenAddress,
      entrypoint: "transfer",
      calldata: [
        params.recipient_address,
        amountUint256.low,
        amountUint256.high,
      ],
    });

    console.log("Transfer transaction hash:", result.transaction_hash);

    await provider.waitForTransaction(result.transaction_hash);
    return JSON.stringify({
      status: "success",
      amount: params.amount,
      symbol: params.symbol,
      recipients_address: params.recipient_address,
      transaction_hash: result.transaction_hash,
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    const errorMessage =
      error instanceof Error
        ? `${error.message}\n${error.stack}`
        : "Unknown error";

    return JSON.stringify({
      status: "failure",
      error: errorMessage,
      step: "transfer execution",
    });
  }
};
