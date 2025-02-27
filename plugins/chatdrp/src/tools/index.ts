import { StarknetTool } from "@starknet-agent-kit/agents";
import { read } from "../actions/read.mjs";
import { send } from "../actions/send.mjs";

export const registerTools = (StarknetToolRegistry: StarknetTool[]) => {
    StarknetToolRegistry.push({
        name: 'send_message_to_drp',
        description:
            'Send a message to a DRP with provided drpId',
        plugins: 'chatdrp',
        execute: send,
    });

    StarknetToolRegistry.push({
        name: 'read_message_to_drp',
        description:
          'Read a message to a DRP with provided drpId',
        plugins: 'chatdrp',
        execute: read,
    });
};
