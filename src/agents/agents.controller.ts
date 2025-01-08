import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  OnModuleInit,
  Post,
} from "@nestjs/common";
import { AgentRequestDTO } from "./dto/agents";
import { CreateAgentDTO } from "./dto/createAgent";
import { ResponseMessage } from "src/lib/decorators/reponse_message";
import { StarknetAgent } from "src/lib/agent/Starknet-Agent-Kit";

@Controller("agents")
export class AgentsController implements OnModuleInit {
  agents: Map<string, StarknetAgent>;

  onModuleInit() {
    this.agents = new Map();
  }

  @Post("create")
  @ResponseMessage("Starknet Agent created successfully")
  async createAgent(@Body() agentConfig: CreateAgentDTO) {
    const { agentName, ...starknetConfig } = agentConfig;
    this.agents.set(agentName, new StarknetAgent(starknetConfig));

    return agentName;
  }

  @Post("request")
  async handleUserRequest(@Body() userRequest: AgentRequestDTO) {
    const agent = this.agents.get(userRequest.agentName);

    if (!agent) {
      throw new BadRequestException("You must create a starknet agent before");
    }

    const result = await agent.execute(userRequest.request);

    return result;
  }
}
