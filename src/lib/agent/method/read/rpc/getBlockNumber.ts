import { RPC_URL } from "src/lib/constant";
import { RpcProvider } from "starknet";

const provider = new RpcProvider({ nodeUrl: RPC_URL });

export const getBlockNumber = async () => {
  try {
    const blockNumber = await provider.getBlockNumber();

    return JSON.stringify({
      status: "success",
      blockNumber: blockNumber.toString(),
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
