import * as dotenv from 'dotenv';

//Getter for you starkent wallet private key
export const get_starknet_private_key = (): string => {
  dotenv.config();

  const privateKey = process.env.STARKNET_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "STARKNET_PRIVATE_KEY n'est pas définie dans le fichier .env",
    );
  }

  return privateKey;
};
