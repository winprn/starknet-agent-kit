import { StarknetTool } from '@starknet-agent-kit/agents';
import {
  contractAddressSchema,
  launchOnEkuboSchema,
  createMemecoinSchema,
} from '../schema/index.js';
import { getLockedLiquidity } from '../actions/getLockedLiquidity.js';
import { isMemecoin } from '../actions/isMemecoin.js';
import { createMemecoin } from '../actions/createMemecoin.js';
import { launchOnEkubo } from '../actions/launchOnEkubo.js';

export const registerTools = (StarknetToolRegistry: StarknetTool[]) => {
  StarknetToolRegistry.push({
    name: 'is_memecoin',
    plugins: 'unruggable',
    description: 'Check if address is a memecoin',
    schema: contractAddressSchema,
    execute: isMemecoin,
  });

  StarknetToolRegistry.push({
    name: 'get_locked_liquidity',
    plugins: 'unruggable',
    description: 'Get locked liquidity info for token',
    schema: contractAddressSchema,
    execute: getLockedLiquidity,
  });

  StarknetToolRegistry.push({
    name: 'create_memecoin',
    plugins: 'unruggable',
    description: 'Create a new memecoin using the Unruggable Factory',
    schema: createMemecoinSchema,
    execute: createMemecoin,
  });

  StarknetToolRegistry.push({
    name: 'launch_on_ekubo',
    plugins: 'unruggable',
    description: 'Launch a memecoin on Ekubo DEX with concentrated liquidity',
    schema: launchOnEkuboSchema,
    execute: launchOnEkubo,
  });
};
