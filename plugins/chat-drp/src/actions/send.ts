import { SendSchema } from "@/schema/schema";
import { Chat } from "@/utils/Chat";
import { StarknetAgentInterface } from "@starknet-agent-kit/agents";
import { DRPNode } from "@ts-drp/node";

export class ReadDRPService {
    node: DRPNode
    drpId: string
    constructor(node: DRPNode, drpId: string) {
        this.node = node;
        this.drpId = drpId;
    }

    async send({ timestamp, message, peerId}: SendSchema) {
        const object = await this.node.connectObject({
            id: this.drpId,
            drp: new Chat()
        })

        const messages = (object.drp as Chat).addMessage(timestamp, message, peerId);
    }
}

export const send = async (agent: StarknetAgentInterface, params: SendSchema) => {
    const readDrpService = new ReadDRPService(params.node, params.drpId);
    return await readDrpService.send(params);
}
