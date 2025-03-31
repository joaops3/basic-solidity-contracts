import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, // ou Infura
      accounts: [process.env.PRIVATE_KEY ?? ''],
    },
  },
};

export default config;
