import { AgentWithDRP, SendSchema } from "../schema/schema.mjs";
import { Chat } from "../utils/Chat.mjs";
import { DRPNode } from "@ts-drp/node";

export class WriteDRPService {
    node: DRPNode
    drpId: string
    constructor(node: DRPNode, drpId: string) {
        console.log(drpId);

        this.node = node;
        this.drpId = drpId;
        console.log("WriteDRPService", this.drpId);
    }

    async send({ timestamp, message, peerId}: SendSchema) {
        const object = this.node.objectStore.get(this.drpId);
        if (!object) {
            return "DRP not found";
        }

        console.log(message, this.drpId);
        (object.drp as Chat).addMessage(timestamp, message, peerId);
        return "Message sent";
    }
}

export const send = async (agent: AgentWithDRP, params: string) => {
    const param = JSON.parse(params);
    const readDrpService = new WriteDRPService(agent.node, param.drpId);
    return await readDrpService.send(param);
}
