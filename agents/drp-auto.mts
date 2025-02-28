import { RpcProvider } from "starknet";
import { AgentWithDRP } from "./agent.mjs";
import { load_json_config } from "./src/jsonConfig";
import { DRPNode } from "@ts-drp/node";
import { loadEnvFile } from "process";
import { Chat } from "../plugins/chatdrp/src/utils/Chat.mjs";

const node2 = new DRPNode({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    },
    credential_config: {
        private_key_seed: "agent2",
    }
});

const agent2_config = load_json_config("agent2.agent.json");
loadEnvFile('.env');
const main = async () => {
    await node2.start();
    while (!await node2.networkNode.isDialable(() => {
        console.log("Network nodes is dialable", node2.networkNode.peerId);
    })) {
        console.log("Wait for dialing", node2.networkNode.peerId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await node2.createObject({
        id: "test",
        drp: new Chat(),
    })

    const agent2 = new AgentWithDRP(node2, {
        provider: new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL }),
        accountPrivateKey: "0xbb",
        accountPublicKey: '0xee',
        aiModel: process.env.AI_MODEL_2 as string,
        aiProvider: process.env.AI_PROVIDER_2  as string,
        aiProviderApiKey: process.env.AI_PROVIDER_API_KEY_2 as string,
        signature: 'key2',
        agentMode: 'auto',
        agentconfig: agent2_config,
    });
    await agent2.createAgentReactExecutor();

    agent2.execute_autonomous();
}
main();
