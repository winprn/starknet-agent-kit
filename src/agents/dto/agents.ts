import { IsNotEmpty } from "class-validator";

export class AgentRequestDTO {
  @IsNotEmpty()
  request: string;
  @IsNotEmpty()
  agentName: string;
}
