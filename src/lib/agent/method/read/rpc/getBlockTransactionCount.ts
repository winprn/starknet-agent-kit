import { RPC_URL } from "src/lib/constant";
import { RpcProvider, BlockNumber } from "starknet";

const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type GetBlockTransactionCountParams = {
  blockIdentifier?: string | number;
};

export const getBlockTransactionCount = async (
  params?: GetBlockTransactionCountParams,
) => {
  try {
    let blockIdentifier: BlockNumber | string =
      params?.blockIdentifier || "latest";

    if (
      typeof blockIdentifier === "string" &&
      !isNaN(Number(blockIdentifier)) &&
      blockIdentifier !== "latest"
    ) {
      blockIdentifier = Number(blockIdentifier);
    }

    const transactionCount =
      await provider.getBlockTransactionCount(blockIdentifier);

    return JSON.stringify({
      status: "success",
      transactionCount: transactionCount.toString(),
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
