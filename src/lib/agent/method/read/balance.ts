import { RPC_URL, tokenAddresses } from 'src/lib/constant';
import { Account, Contract, RpcProvider } from 'starknet';


// Initialize provider
const provider = new RpcProvider({ nodeUrl: RPC_URL });

export type GetOwnBalanceParams = {
  symbol: string;
};

const formatBalance = (rawBalance: string): string => {
  const balancePadded = rawBalance.padStart(19, '0');
  const decimalPosition = balancePadded.length - 18;
  const formattedBalance = balancePadded.slice(0, decimalPosition) + '.' + balancePadded.slice(decimalPosition);
  return parseFloat(formattedBalance).toString();
}

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  try {
    const walletAddress = process.env.PUBLIC_ADDRESS;
    console.log(walletAddress);
    if (!walletAddress) {
      throw new Error('Wallet address not configured');
    }

    // Account Instance
    const account = new Account(provider, walletAddress, privateKey);

    const tokenAddress = tokenAddresses[params.symbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.symbol} not supported`);
    }

    const tokenContract = new Contract(erc20ABI, tokenAddress, provider);
    console.log(tokenContract);

    const balance = await tokenContract.balanceOf(account.address);

    //const decimalBalance = formatBalance(rawBalance);
    console.log(balance.balance.toString());
    return JSON.stringify({
      status: 'success',
      balance: balance.balance.toString(),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export type GetBalanceParams = {
  walletAddress: string;
  assetSymbol: string;
};

export const getBalance = async (params: GetBalanceParams) => {
  try {
    const tokenAddress = tokenAddresses[params.assetSymbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.assetSymbol} not supported`);
    }

    const tokenContract = new Contract(erc20ABI, tokenAddress, provider);

    const balance = await tokenContract.balanceOf(params.walletAddress);

    const rawBalance = balance.balance.toString();
    
    console.log(rawBalance);
    return JSON.stringify({
      status: 'success',
      balance: balance.balance.toString(),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Basic ERC20 ABI for balanceOf
const erc20ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "felt"
      }
    ],
    outputs: [
      {
        name: "balance",
        type: "Uint256"
      }
    ],
    stateMutability: "view"
  }
];