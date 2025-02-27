import { DRPNode } from "@ts-drp/node"

export type ReadSchema = {
    drpId: string
    node: DRPNode
}

export type SendSchema = {
    drpId: string,
    node: DRPNode,
    timestamp: string,
    message: string,
    peerId: string
}
