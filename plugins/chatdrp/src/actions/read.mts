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
        console.log("Read DRP", this.drpId, messages);

        return Array.from(messages);
    }
}

export const read = async (agent: AgentWithDRP, params: string): Promise<string[]> => {
    console.log("Reading DRP", params);
    const param: ReadSchema = JSON.parse(params);
    const readDrpService = new ReadDRPService(agent.node, param.drpId);

    return await readDrpService.read();
}
