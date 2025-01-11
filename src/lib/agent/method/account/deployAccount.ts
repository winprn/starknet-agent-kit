import { RPC_URL } from "src/lib/constant";
import { Account, RpcProvider, hash, CallData } from "starknet";
import { StarknetAgent } from "../../starknetAgent";
import { AccountDetails } from "src/lib/utils/types";

const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type DeployOZAccountParams = {
  publicKey: string;
  privateKey: string;
};

export const DeployOZAccount = async (params: {
  publicKey: string;
  privateKey: string;
}) => {
  try {
    const agent = new StarknetAgent({
      walletPrivateKey: process.env.STARKNET_PRIVATE_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const accountDetails: AccountDetails = {
      publicKey: params.publicKey,
      privateKey: params.privateKey,
      address: "", // Will be calculated by deployAccount
      deployStatus: false,
    };

    // First estimate the deployment fee
    const estimatedFee =
      await agent.accountManager.estimateAccountDeployFee(accountDetails);
    console.log("Estimated deployment fee:", estimatedFee);

    // Deploy the account
    const result = await agent.accountManager.deployAccount(accountDetails);

    // Monitor the deployment transaction
    if (!result.transactionHash) {
      throw new Error("No transaction hash returned from deployment");
    }

    const receipt = await agent.transactionMonitor.waitForTransaction(
      result.transactionHash,
      (status) => console.log("Deployment status:", status),
    );

    return JSON.stringify({
      status: "success",
      wallet: "Open Zeppelin",
      transaction_hash: result.transactionHash,
      receipt: receipt,
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export type DeployArgentParams = {
  publicKeyAX: string;
  privateKeyAX: string;
};
export const DeployArgentAccount = async (params: DeployArgentParams) => {
  try {
    const argentXaccountClassHash =
      "0x1a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003";
    const AXConstructorCallData = CallData.compile({
      owner: params.publicKeyAX,
      guardian: "0",
    });
    const AXcontractAddress = hash.calculateContractAddressFromHash(
      params.publicKeyAX,
      argentXaccountClassHash,
      AXConstructorCallData,
      0,
    );

    const accountAX = new Account(
      provider,
      AXcontractAddress,
      params.privateKeyAX,
    );

    const deployAccountPayload = {
      classHash: argentXaccountClassHash,
      constructorCalldata: AXConstructorCallData,
      contractAddress: AXcontractAddress,
      addressSalt: params.publicKeyAX,
    };

    const {
      transaction_hash: AXdAth,
      contract_address: AXcontractFinalAddress,
    } = await accountAX.deployAccount(deployAccountPayload);
    console.log("ArgentX wallet deployed at:", AXcontractFinalAddress);
    return JSON.stringify({
      status: "success",
      wallet: "Open Zeppelin",
      contract_address: AXcontractFinalAddress,
    });
  } catch (error) {
    return JSON.stringify({
      status: "failure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
