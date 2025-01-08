// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Wallet {
    address private owner;

    constructor(){
        owner = msg.sender;
    }

    event Withdraw(address owner, uint256 amount);


    modifier onlyOwner(){
        require(msg.sender == owner, "not allowed");
        _;
    }

    receive() external payable {
    }

   function withdraw(uint256 amount) public onlyOwner {
    require(amount <= address(this).balance, "Insufficient funds");
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed");
    emit Withdraw(owner, amount);
}

    function getOwner()public  view returns(address){
        return owner;
    }

    function getBalance() public view returns (uint256) {
    return address(this).balance;
}
}
