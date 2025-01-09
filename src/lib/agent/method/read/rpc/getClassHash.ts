import { RPC_URL } from "src/lib/constant";
import { RpcProvider, BlockNumber } from "starknet";

const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type GetClassHashParams = {
  contractAddress: string;
  blockIdentifier?: string | number;
};

export const getClassHash = async (params: GetClassHashParams) => {
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

    // Note the order of parameters for getClassHashAt is different from getClassAt!
    const classHash = await provider.getClassHashAt(
      params.contractAddress,
      blockIdentifier,
    );

    return JSON.stringify({
      status: "success",
      classHash,
    });
  } catch (error) {
    console.error("GetClassHash error:", error);
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
