import { DRPNode } from '@ts-drp/node'
import { StarknetAgent } from './src/starknetAgent';
import { RpcProvider } from 'starknet';
import { load_json_config } from './src/jsonConfig';
import { createInterface } from 'readline';

const node1 = new DRPNode({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    }
});
const node2 = new DRPNode({
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

const main = async () => {
    await node1.start();
    while (!await node1.networkNode.isDialable() || !await node2.networkNode.isDialable()) {
        console.log("Waiting for network nodes to be dialable...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("Network nodes is dialable");

    const agent = new StarknetAgent({
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

    agent2.execute_autonomous();
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
            After that, please actively check for the answer in the DRP. In case of an answer, please print it out.
        `);
        console.log(resp);
    }
}
main()
