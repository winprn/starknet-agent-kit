import { RPC_URL } from "src/lib/constant";
import { RpcProvider } from "starknet";

// Initialize provider
const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type GetStorageParams = {
  contractAddress: string;
  key: string;
  blockIdentifier?: string;
};

export const getStorageAt = async (params: GetStorageParams) => {
  try {
    const storage = await provider.getStorageAt(
      params.contractAddress,
      params.key,
      params.blockIdentifier || "latest",
    );

    return JSON.stringify({
      status: "success",
      storage: storage.toString(),
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
