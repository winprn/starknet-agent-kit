import { Account, Contract, RpcProvider } from 'starknet';
import { DEFAULT_RPC_URL, tokenAddresses } from '../../constant';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: process.env.STARKNET_RPC_URL || DEFAULT_RPC_URL,
});

export type GetOwnBalanceParams = {
  symbol: string;
};

const formatBalance = (rawBalance: string): string => {
  // S'il y a moins de 18 chiffres, ajouter des zéros au début
  const balancePadded = rawBalance.padStart(19, '0');

  // Trouver la position du point décimal
  const decimalPosition = balancePadded.length - 18;

  // Insérer le point décimal
  const formattedBalance =
    balancePadded.slice(0, decimalPosition) +
    '.' +
    balancePadded.slice(decimalPosition);

  // Supprimer les zéros inutiles après le point et le point si nécessaire
  return parseFloat(formattedBalance).toString();
};

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

    // Create account instance
    const account = new Account(provider, walletAddress, privateKey);

    const tokenAddress = tokenAddresses[params.symbol];
    if (!tokenAddress) {
      throw new Error(`Token ${params.symbol} not supported`);
    }

    // Get token contract
    const tokenContract = new Contract(erc20ABI, tokenAddress, provider);

    // Call balanceOf
    const balance = await tokenContract.balanceOf(account.address);
    const rawBalance = balance.balance.toString();

    // Gérer le décalage de 18 décimales
    const decimalBalance = formatBalance(rawBalance);

    return JSON.stringify({
      status: 'success',
      balance: decimalBalance,
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

    // Get token contract
    const tokenContract = new Contract(erc20ABI, tokenAddress, provider);

    // Call balanceOf
    const balance = await tokenContract.balanceOf(params.walletAddress);

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
    name: 'balanceOf',
    type: 'function',
    inputs: [
      {
        name: 'account',
        type: 'felt',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'Uint256',
      },
    ],
    stateMutability: 'view',
  },
];
