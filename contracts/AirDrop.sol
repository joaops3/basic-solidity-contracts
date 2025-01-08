pragma solidity ^0.8.28;

import "./Token.sol";

contract Airdrop {
    CustomToken private token;
    address public owner;

    event AirdropDistributed(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(address tokenAddress) {
        token = CustomToken(tokenAddress);
        owner = msg.sender;
    }

    function distribute(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Recipients and amounts length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.balanceOf(address(this)) >= amounts[i], "Insufficient tokens in contract");
            token.transfer(recipients[i], amounts[i]);
            emit AirdropDistributed(recipients[i], amounts[i]);
        }
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient tokens in contract");
        token.transfer(owner, amount);
    }
}