import { Injectable } from "@nestjs/common";
import { StarknetAgent } from "src/lib/agent/starknetAgent";
import { AgentRequestDTO } from "./dto/agents";

@Injectable()
export class AgentsService {
  async handleUserRequest(agent: StarknetAgent, userRequest: AgentRequestDTO) {
    const result = await agent.execute(userRequest.request);

    return result;
  }
}
