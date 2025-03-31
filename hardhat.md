# Sample Hardhat Project

Try running some of the following tasks:

## test

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test

npx hardhat test ./test/file --network sepolia
```

## deploy

```shell
npx hardhat help

# local node
npx hardhat node

npx hardhat compile


npx hardhat ignition deploy ./ignition/modules/Wallet.ts --network localhost
or

npx hardhat run ./ignition/modules/MultiSig.ts --network localhost

npx hardhat run ./ignition/modules/MultiSig.ts --network sepolia
```
