import { buildModule } from '@nomicfoundation/ignition-core';

export default buildModule('FundMeModule', (m) => {
  // const mockOracle = m.contract('MockAggregatorV3'); // 2000 * 10^8
  const fundMe = m.contract('DataConsumerV3');

  return { fundMe };
});
