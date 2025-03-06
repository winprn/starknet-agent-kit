import {
  StarknetAgentInterface,
  StarknetTool,
} from '@starknet-agent-kit/agents';
import { getProofService } from '../actions/getProofService.js';
import {
  GetProofServiceSchema,
  VerifyProofServiceSchema,
} from '../schema/index.js';
import { verifyProofService } from '../actions/verifyProofService.js';

export const registerTools = (StarknetToolRegistry: StarknetTool[]) => {
  StarknetToolRegistry.push({
    name: 'get_proof_service',
    plugins: 'atlantic',
    description:
      "Query atlantic api to generate a proof from '.zip' file on starknet and return the query id",
    schema: GetProofServiceSchema,
    execute: getProofService,
  });

  StarknetToolRegistry.push({
    name: 'verify_proof_service',
    plugins: 'atlantic',
    description:
      "Query atlantic api to verify a proof from '.json' file on starknet and return the query id",
    schema: VerifyProofServiceSchema,
    execute: verifyProofService,
  });
};
