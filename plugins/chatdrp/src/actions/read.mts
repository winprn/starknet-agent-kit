import { DRPNode } from "@ts-drp/node";
import { StarknetAgentInterface } from '@starknet-agent-kit/agents'
import { Chat } from "../utils/Chat.mjs";
import { AgentWithDRP, ReadSchema } from "../schema/schema.mjs";

export class ReadDRPService {
    static node: DRPNode = new DRPNode({
        log_config: {
            level: "error",
        },
        network_config: {
            log_config: {
                level: "error",
            }
        },
    });
    drpId: string;
    constructor(drpId: string) {
        this.drpId = drpId;
    }

    async read(): Promise<string[]> {
        return await ReadDRPService.run(async () => {
            const object = await ReadDRPService.node.connectObject({
                id: this.drpId,
                drp: new Chat(),
            });
            if (!object) {
                return [];
            }
            (object.drp as Chat).addMessage(Date.now().toString(), "Read", ReadDRPService.node.networkNode.peerId);
            const messages = (object.drp as Chat).query_messages();
            console.log("Read DRP", this.drpId, messages);

            return Array.from(messages);
        });
    }

    private static async run(callback: () => Promise<any>) {
        await ReadDRPService.node.start();
        while (!await ReadDRPService.node.networkNode.isDialable(() => {
            console.log("Network nodes is dialable", ReadDRPService.node.networkNode.peerId);
        })) {
            console.log("Wait for dialing", ReadDRPService.node.networkNode.peerId);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        while (this.node.networkNode.getAllPeers().length < 3) {
            console.log("Wait for peers", this.node.networkNode.peerId);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        return await callback();
    }
}

export const read = async (agent: AgentWithDRP, params: string): Promise<string[]> => {
    const param: ReadSchema = JSON.parse(params);
    const readDrpService = new ReadDRPService(param.drpId);
    return await readDrpService.read();
}
