// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomNFTToken is ERC721, Ownable {
    uint256 public nextTokenId;
   
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory _name, string memory _symbol) Ownable(msg.sender)
        ERC721(_name, _symbol)
    {
      
    }


    function mint(address to, string memory tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }


    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

   
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }


}
