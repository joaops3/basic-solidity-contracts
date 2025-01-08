import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TokenModule = buildModule('TokenModule', (m) => {
  const Token = m.contract('CustomToken', ['CustomToken', 'CT', 20]);

  return { Token };
});

export default TokenModule;
