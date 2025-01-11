import { Account } from "starknet";
import { tokenAddresses } from "src/lib/constant";
import { StarknetAgent } from "../../starknetAgent";

const ERC20_ABI = [
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
        "StarknetPrivateKey or PublicKey is not set in your .env file!",
      );
    }

    // Initialize agent and get utilities
    const agent = new StarknetAgent({
      walletPrivateKey: privateKey,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const account = new Account(
      agent.contractInteractor.provider,
      accountAddress,
      privateKey,
    );

    // Get token contract address
    const tokenAddress = tokenAddresses[params.symbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.symbol} not supported`);
    }

    // Create contract instance
    const contract = agent.contractInteractor.createContract(
      ERC20_ABI,
      tokenAddress,
      account,
    );

    // Format amount
    const formattedAmount = agent.contractInteractor.formatTokenAmount(
      params.amount,
      params.symbol === "USDC" || params.symbol === "USDT" ? 6 : 18,
    );

    // Estimate gas fees first
    const estimatedFee = await agent.contractInteractor.estimateContractWrite(
      contract,
      "transfer",
      [params.recipient_address, formattedAmount],
    );

    console.log("Estimated transfer fee:", estimatedFee);

    // Execute transfer
    const result = await agent.contractInteractor.writeContract(
      contract,
      "transfer",
      [params.recipient_address, formattedAmount],
    );

    if (result.status === "success" && result.transactionHash) {
      // Monitor transaction
      const receipt = await agent.transactionMonitor.waitForTransaction(
        result.transactionHash,
        (status) => console.log("Transfer status:", status),
      );

      // Get transaction events
      const events = await agent.transactionMonitor.getTransactionEvents(
        result.transactionHash,
      );

      return JSON.stringify({
        status: "success",
        amount: params.amount,
        symbol: params.symbol,
        recipients_address: params.recipient_address,
        transaction_hash: result.transactionHash,
        events: events,
        receipt: receipt,
      });
    } else {
      throw new Error(result.error || "Transfer failed");
    }
  } catch (error) {
    console.error("Detailed error:", error);
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
      step: "transfer execution",
    });
  }
};
