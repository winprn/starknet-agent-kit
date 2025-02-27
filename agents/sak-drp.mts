import { DRPNode } from '@ts-drp/node';
import { StarknetAgent } from './src/starknetAgent';
import { RpcProvider } from 'starknet';
import { load_json_config } from './src/jsonConfig';
import { createInterface } from 'readline';
import { loadEnvFile } from 'process';
import { AgentWithDRP } from './agent.mjs';
import { Chat } from '../plugins/chatdrp/src/utils/Chat.mjs';
import { raceEvent } from 'race-event';

const node = new DRPNode!({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    }
});

const node2 = new DRPNode!({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    }
});

const agent1_config = load_json_config("agent1.agent.json");
const agent2_config = load_json_config("agent2.agent.json");
loadEnvFile('.env');

const main = async () => {
    await node.start();
    await node2.start();
    while (!await node.networkNode.isDialable(() => {
        console.log("Node 1 is dialable", node.networkNode.peerId);
    }) || !await node2.networkNode.isDialable(() => {
        console.log("Node 2 is dialable", node2.networkNode.peerId);
    })) {
        console.log("Waiting for network nodes to be dialable...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    while (!node.networkNode.getAllPeers().includes(node2.networkNode.peerId)) {
        console.log("Connecting network nodes...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Network nodes is dialable");
    try {
        await node2.createObject({
            id: "test",
            drp: new Chat()
        })

        console.log(node.networkNode.getAllPeers());
        await node.connectObject({
            id: "test",
            drp: new Chat(),
            sync: {
                peerId: node2.networkNode.peerId
            }
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

    const agent2 = new StarknetAgent({
        provider: new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL }),
        accountPrivateKey: process.env.STARKNET_PRIVATE_KEY as string,
        accountPublicKey: process.env.STARKNET_PUBLIC_ADDRESS  as string,
        aiModel: process.env.AI_MODEL as string,
        aiProvider: process.env.AI_PROVIDER  as string,
        aiProviderApiKey: process.env.AI_PROVIDER_API_KEY as string,
        signature: 'key',
        agentMode: 'auto',
        agentconfig: agent2_config,
    });
    await agent2.createAgentReactExecutor();

    // agent2.execute_autonomous();
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
            Please parse the following message and put it into the DRP to ask for an answer:
            ${line}.
            You'll need to pass along the message, the timestamp, and the peerId, which is your name.
            You'll also need to pass along the DRP ID, which is test.
            After that, please actively check for the answer in the DRP. In case of an answer, please print it out.
        `);
        console.log(resp);
    }
}
main()
