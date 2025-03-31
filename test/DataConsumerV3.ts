import { Signer } from 'ethers';
import { expect } from 'chai';
import hre from 'hardhat';
import { DataConsumerV3 } from '../typechain-types';

describe('DataConsumerV3', function () {
  let deployer: Signer, user1: Signer;
  let contract: DataConsumerV3;

  before(async function () {
    [deployer, user1] = await hre.ethers.getSigners();
    contract = await hre.ethers.getContractAt(
      'DataConsumerV3',
      '0x0a60f48fE7b7C32C4FB590b03691247502f9F894',
      deployer
    );
  });

  describe('Deployment', function () {
    it('it should return data from chainlink oracle', async function () {
      const data = await contract.getChainlinkDataFeedLatestAnswer();
      console.log('data here', data?.toString());
      expect(data?.toString()).not.to.be.null;
    });
  });
});
