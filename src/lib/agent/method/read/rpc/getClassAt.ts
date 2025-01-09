import { RPC_URL } from "src/lib/constant";
import { RpcProvider, BlockNumber } from "starknet";

const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type GetClassAtParams = {
  contractAddress: string;
  blockIdentifier?: string | number;
};

export const getClassAt = async (params: GetClassAtParams) => {
  try {
    let blockIdentifier: BlockNumber | string =
      params.blockIdentifier || "latest";

    if (
      typeof blockIdentifier === "string" &&
      !isNaN(Number(blockIdentifier)) &&
      blockIdentifier !== "latest"
    ) {
      blockIdentifier = Number(blockIdentifier);
    }

    const contractClass = await provider.getClassAt(
      params.contractAddress,
      blockIdentifier,
    );

    return JSON.stringify({
      status: "success",
      contractClass,
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
