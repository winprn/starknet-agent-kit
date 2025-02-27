import { read } from "@/actions/read";
import { send } from "@/actions/send";
import { StarknetTool, StarknetAgentInterface } from "@starknet-agent-kit/agents";

export const registerTools = (StarknetToolRegistry: StarknetTool[]) => {
    StarknetToolRegistry.push({
        name: 'send_message_to_drp',
        description:
            'Send a message to a DRP with provided drpId',
        plugins: 'chat-drp',
        execute: send,
    });

    StarknetToolRegistry.push({
        name: 'read_message_to_drp',
        description:
          'Read a message to a DRP with provided drpId',
        plugins: 'chat-drp',
        execute: read,
    });
};
