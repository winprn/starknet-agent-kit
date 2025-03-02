import { DRPNode } from '@ts-drp/node';
import { StarknetAgent } from './src/starknetAgent';
import { RpcProvider } from 'starknet';
import { load_json_config } from './src/jsonConfig';
import { createInterface } from 'readline';
import { loadEnvFile } from 'process';
import { AgentWithDRP } from './agent.mjs';
import { Chat } from '../plugins/chatdrp/src/utils/Chat.mjs';
import { raceEvent } from 'race-event';
import { Connection, Libp2p } from "@libp2p/interface";

const node = new DRPNode!({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    },
    credential_config: {
        private_key_seed: "agent1",
    }
});

const agent1_config = load_json_config("agent1.agent.json");
loadEnvFile('.env');

interface DialableResult {
    dialableNode: DRPNode;
    nodeThatDial: DRPNode;
    peerId: string;
}

async function isDialableHelper(dialableNode:DRPNode, nodeToDial:DRPNode): Promise<DialableResult> {
    return new Promise<DialableResult>((resolve) => {
        dialableNode.networkNode.isDialable(() => resolve({ dialableNode: dialableNode, nodeThatDial: nodeToDial, peerId: dialableNode.networkNode.peerId }));
    });
}

const main = async () => {
    await node.start();
    while (!await node.networkNode.isDialable(() => {
        console.log("Network nodes is dialable", node.networkNode.peerId);
    })) {
        console.log("Wait for dialing", node.networkNode.peerId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    while (node.networkNode.getAllPeers().length < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
        await node.connectObject({
            id: "test",
            drp: new Chat(),
        })
    } catch (_) {

    }

    const agent = new AgentWithDRP(node, {
        provider: new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL }),
        accountPrivateKey: process.env.STARKNET_PRIVATE_KEY as string,
        accountPublicKey: process.env.STARKNET_PUBLIC_ADDRESS  as string,
        aiModel: process.env.AI_MODEL as string,
        aiProvider: process.env.AI_PROVIDER  as string,
        aiProviderApiKey: process.env.AI_PROVIDER_API_KEY as string,
        signature: 'key',
        agentMode: 'agent',
        agentconfig: agent1_config,
    });
    await agent.createAgentReactExecutor();

    while (true) {
        const line = await new Promise<string>((resolve) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter message: ', (answer: string) => {
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
}
main()
