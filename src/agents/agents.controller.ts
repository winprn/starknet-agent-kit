import { Body, Controller, OnModuleInit, Post } from "@nestjs/common";
import { AgentRequestDTO } from "./dto/agents";
import { StarknetAgent } from "src/lib/agent/starknetAgent";
import { AgentsService } from "./agents.service";

@Controller("agent")
export class AgentsController implements OnModuleInit {
  agent: StarknetAgent;
  constructor(private readonly agentService: AgentsService) {}

  onModuleInit() {
    this.agent = new StarknetAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      walletPrivateKey: process.env.STARKNET_PRIVATE_KEY,
    });
  }

  @Post("request")
  async handleUserRequest(@Body() userRequest: AgentRequestDTO) {
    return await this.agentService.handleUserRequest(this.agent, userRequest);
  }
}
