pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// https://docs.openzeppelin.com/contracts/4.x/erc20

contract CustomToken is ERC20 {

    address public owner;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor(string memory _name, string memory _symbol, uint256 initialSupply) ERC20(_name, _symbol) {
        owner = msg.sender;
        _mint(msg.sender,( initialSupply* (10 ** decimals()) ));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint tokens");
            _;
    }

    function mint(address recipient, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= totalSupply(), "Minting exceeds total supply");
        _mint(recipient, amount);
        emit Mint(recipient, amount);
    }

   function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}