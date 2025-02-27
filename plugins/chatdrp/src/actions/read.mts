import { DRPNode } from "@ts-drp/node";
import { StarknetAgentInterface } from '@starknet-agent-kit/agents'
import { Chat } from "../utils/Chat.mjs";
import { AgentWithDRP, ReadSchema } from "../schema/schema.mjs";

export class ReadDRPService {
    node: DRPNode
    drpId: string
    constructor(node: DRPNode, drpId: string) {
        this.node = node;
        this.drpId = drpId;
    }

    async read(): Promise<string[]> {
        const object = this.node.objectStore.get(this.drpId);
        if (!object) {
            return [];
        }

        const messages = (object.drp as Chat).query_messages();
        return Array.from(messages);
    }
}

export const read = async (agent: AgentWithDRP, params: ReadSchema): Promise<string[]> => {
    console.log("Reading DRP", params);
    const readDrpService = new ReadDRPService(agent.node, params.drpId);

    return await readDrpService.read();
}
