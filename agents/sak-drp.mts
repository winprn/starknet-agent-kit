import { DRPNode } from "@ts-drp/node";
import { StarknetAgent } from "agents/src/starknetAgent.js";
import { RpcProvider } from "starknet";
import { load_json_config } from "./src/jsonConfig.js";
import { createInterface } from "readline";
import { loadEnvFile } from "process";

const agent1_config = load_json_config("agent1.agent.json");
loadEnvFile(".env");

const main = async () => {
	const agent = new StarknetAgent({
		provider: new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL }),
		accountPrivateKey: process.env.STARKNET_PRIVATE_KEY as string,
		accountPublicKey: process.env.STARKNET_PUBLIC_ADDRESS as string,
		aiModel: process.env.AI_MODEL as string,
		aiProvider: process.env.AI_PROVIDER as string,
		aiProviderApiKey: process.env.AI_PROVIDER_API_KEY as string,
		signature: "key",
		agentMode: "agent",
		agentconfig: agent1_config,
	});
	await agent.createAgentReactExecutor();

	while (true) {
		const line = await new Promise<string>((resolve) => {
			const rl = createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			rl.question("Enter message: ", (answer: string) => {
				resolve(answer);
				rl.close();
			});
		});

		const resp = await agent.execute(`
            If the following message is not a question, please follow it's instructions, dont ask to DRP for an answer:
            ${line}.
            Otherwise, please send it to the DRP.
            You'll need to pass along the message, the timestamp, and the peerId, which is your name.
            You'll also need to pass along the DRP ID, which is test.
            Please pass the value as an object corresponding to the SendSchema.
            After that, please actively check for the answer in the DRP. The answer will contain your name at the end. Please automatically parse the answer and print it out.
        `);
		console.log(resp);
	}
};
main();
