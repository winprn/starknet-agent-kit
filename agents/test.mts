import { DRPNode } from "@ts-drp/node";
import { Chat } from "../plugins/chatdrp/src/utils/Chat.mjs";
import { createInterface } from "readline";

const node2 = new DRPNode({
    log_config: {
        level: "error",
    },
    network_config: {
        log_config: {
            level: "error",
        }
    },
    credential_config: {
        private_key_seed: "agent2",
    }
});

const main = async () => {
    await node2.start();
    while (!await node2.networkNode.isDialable(() => {
        console.log("Network nodes is dialable", node2.networkNode.peerId);
    })) {
        console.log("Wait for dialing", node2.networkNode.peerId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const obj = await node2.createObject({
        id: "test",
        drp: new Chat(),
    })

    while (true) {
        const line = await new Promise<string>((resolve) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter msg: ', (answer: string) => {
                resolve(answer);
                rl.close();
            });
        });

        (obj.drp as Chat).addMessage(Date.now().toString(), line, node2.networkNode.peerId);
    }
}
main();
