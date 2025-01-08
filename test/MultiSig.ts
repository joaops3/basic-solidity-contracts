import { expect } from 'chai';
import hre from 'hardhat';
import { MultiSig } from '../typechain-types';
import { EventLog, Signer } from 'ethers';

describe('MultiSig', function () {
  let deployer: Signer, user1: Signer;
  let contract: MultiSig;

  before(async function () {
    [deployer, user1] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory('MultiSig');
    const addresses = await Promise.all([
      deployer.getAddress(),
      user1.getAddress(),
    ]);
    contract = await factory.deploy(addresses, 2);
  });

  describe('Deploy', () => {
    it('Should have owners', async () => {
      expect((await contract.getOwners()).length).to.have.length.equal(2);
    });

    describe('Transaction', () => {
      let currentTransactionId: number;

      it('should deposit', async () => {
        const inicialBalance = await hre.ethers.provider.getBalance(
          await contract.getAddress()
        );
        const QTD = hre.ethers.parseEther('1');
        const transaction = await user1.sendTransaction({
          to: await contract.getAddress(),
          value: QTD,
        });
        expect(transaction).to.emit(contract, 'Deposit');
        expect(
          await hre.ethers.provider.getBalance(await contract.getAddress())
        ).to.be.above(inicialBalance);
      });

      it('should create transaction', async () => {
        const to = await user1.getAddress();
        const value = hre.ethers.parseEther('1');
        const transaction = await contract
          .connect(user1)
          .createTransaction(to, { value: value });
        const result = await transaction.wait();

        const event = result?.logs?.find(
          (i: any) => i?.fragment?.name == 'CreateTransaction'
        );
        currentTransactionId = (event as any)?.args[3];
        expect(transaction).to.emit(contract, 'CreateTransaction');
        expect(event).not.to.be.undefined;
        expect(currentTransactionId).not.to.be.undefined;
      });

      it('should get transaction', async () => {
        const transaction = await contract.getTransaction(currentTransactionId);
        expect(transaction).not.to.be.undefined;
        expect(transaction?.numberOfApprovals).to.be.equal(1);
        expect(transaction?.isActive).to.be.true;
      });

      it('should fail to approve, because is already approved', async () => {
        expect(contract.connect(user1).approveTransaction(currentTransactionId))
          .to.throw;

        const getTransaction = await contract.getTransaction(
          currentTransactionId
        );
        expect(getTransaction?.numberOfApprovals).to.be.equal(1);
      });

      it('should revoke approval', async () => {
        const transaction = await contract
          .connect(user1)
          .revokeApproval(currentTransactionId);
        const getTransaction = await contract.getTransaction(
          currentTransactionId
        );
        expect(transaction).to.emit(contract, 'RevokeApproval');
        expect(getTransaction?.numberOfApprovals).to.be.equal(0);
      });

      it('should approve', async () => {
        const transaction = await contract
          .connect(user1)
          .approveTransaction(currentTransactionId);
        await transaction.wait();

        const getTransaction = await contract.getTransaction(
          currentTransactionId
        );
        expect(transaction).to.emit(contract, 'ApproveTransaction');
        expect(getTransaction?.numberOfApprovals).to.be.equal(1);
      });

      it('should send transaction', async () => {
        const inicialUserBalance = await hre.ethers.provider.getBalance(
          await user1.getAddress()
        );
        const transaction = await contract
          .connect(deployer)
          .approveTransaction(currentTransactionId);

        const result = await transaction.wait();
        const event = result?.logs?.find(
          (i: any) => i?.fragment?.name == 'SendTransaction'
        );

        const getTransaction = await contract.getTransaction(
          currentTransactionId
        );

        const balanceAfter = await hre.ethers.provider.getBalance(
          await user1.getAddress()
        );
        expect(getTransaction?.isActive).to.be.false;

        expect(transaction).to.emit(contract, 'SendTransaction');
        expect(event).not.to.be.undefined;
        expect((event as EventLog).args[0]).to.be.equal(currentTransactionId);
        expect(balanceAfter).to.be.above(inicialUserBalance);
      });
    });
  });
});
