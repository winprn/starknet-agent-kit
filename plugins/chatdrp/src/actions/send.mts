import { AgentWithDRP, SendSchema } from "../schema/schema.mjs";
import { Chat } from "../utils/Chat.mjs";
import { DRPNode } from "@ts-drp/node";

export class WriteDRPService {
    node: DRPNode
    drpId: string
    constructor(node: DRPNode, drpId: string) {
        this.node = node;
        this.drpId = drpId;
        console.log("WriteDRPService", this.drpId);
    }

    async send({ timestamp, message, peerId}: SendSchema) {
        const object = this.node.objectStore.get(this.drpId);
        if (!object) {
            return;
        }

        console.log(object, this.drpId);
        (object.drp as Chat).addMessage(timestamp, message, peerId);
    }
}

export const send = async (agent: AgentWithDRP, params: SendSchema) => {
    console.log("Sending DRP", params);
    const readDrpService = new WriteDRPService(agent.node, params.drpId);
    return await readDrpService.send(params);
}
