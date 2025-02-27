import { StarknetAgent } from "@starknet-agent-kit/agents";
import { DRPNode } from "@ts-drp/node"

export type ReadSchema = {
    drpId: string,
}

export type SendSchema = {
    drpId: string,
    timestamp: string,
    message: string,
    peerId: string,
}

export interface AgentWithDRP extends StarknetAgent  {
    node: DRPNode
}
