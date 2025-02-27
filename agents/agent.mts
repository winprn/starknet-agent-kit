import { DRPNode } from "@ts-drp/node";
import { StarknetAgent } from "./src/starknetAgent";

export class AgentWithDRP extends StarknetAgent {
    node: DRPNode
    constructor(node: DRPNode, config: any) {
        super(config);
        this.node = node;
    }
}
