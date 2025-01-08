import { StarknetAgent } from './index.js';
import { config } from 'dotenv';
import { GetOwnBalanceParams } from './Method/read/balance.js';

// Charger les variables d'environnement
config();

// Type pour les paramètres de balance
interface BalanceParams extends GetOwnBalanceParams {
    // Ajoutez ici les paramètres spécifiques si nécessaire
}

async function initializeAgent(): Promise<StarknetAgent> {
    const privateKey = process.env.STARKNET_PRIVATE_KEY;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!privateKey || !apiKey) {
        throw new Error('Missing environment variables. Please check your .env file');
    }

    return new StarknetAgent({
        walletPrivateKey: privateKey,
        anthropicApiKey: apiKey
    });
}

async function main() {
    try {
        console.log('🚀 Initializing Starknet Agent...');
        const agent = await initializeAgent();
        
        console.log('✅ Agent initialized successfully');
        
        // Vérifier les credentials
        const credentials = agent.getCredentials();
        console.log('🔑 Credentials loaded:', {
            hasPrivateKey: credentials.walletPrivateKey,
            hasApiKey: credentials.anthropicApiKey
        });

        await agent.execute(
            'ETH' ,
        );
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}

// Exécuter le programme
main().catch(console.error);