import { Chat } from "@/utils/Chat";
import { DRPNode } from "@ts-drp/node";
import { StarknetAgentInterface } from '@starknet-agent-kit/agents'
import { ReadSchema } from "@/schema/schema";

export class ReadDRPService {
    node: DRPNode
    drpId: string
    constructor(node: DRPNode, drpId: string) {
        this.node = node;
        this.drpId = drpId;
    }

    async read(): Promise<string[]> {
        const object = await this.node.connectObject({
            id: this.drpId,
            drp: new Chat()
        })

        const messages = (object.drp as Chat).query_messages();
        return Array.from(messages);
    }
}

export const read = async (agent: StarknetAgentInterface, params: ReadSchema): Promise<string[]> => {
    const readDrpService = new ReadDRPService(params.node, params.drpId);
    return await readDrpService.read();
}
