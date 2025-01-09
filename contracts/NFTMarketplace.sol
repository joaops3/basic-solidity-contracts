// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract NFTMarketplace {
    address private owner;

    struct Listening {
        address seller;
        uint256 price;
    }

    constructor(){
        owner = msg.sender;
    }

    mapping(address => mapping(uint256 => Listening)) public nftListings;

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, uint256 price);
    event Withdraw(address owner, uint256 amount);
    event NFTListingCanceled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    
    modifier onlyOwner(){
        require(msg.sender == owner, "not allowed");
        _;
    }

    receive() external payable {
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price) external {
        
        require(price > 0, "Price must be greater than 0");

        IERC721 nft = IERC721(nftContract);


        require(nft.ownerOf(tokenId) == msg.sender, "you must be ne owner of the NFT");
       
        Listening memory listing = Listening({
            seller: msg.sender,
            price: price
        });
     
        // Transfer nft as assurance
        nft.transferFrom(msg.sender, address(this), tokenId);

        nftListings[nftContract][tokenId] = listing;
       
        emit NFTListed(address(nftContract), tokenId, listing.seller, listing.price);
    }


    function buyNFT(address nftContract, uint256 tokenId) external payable {
        Listening memory listing = nftListings[nftContract][tokenId];

        require(listing.seller != address(0), "NFT not for sale");

        require(msg.value >= listing.price, "insufficient funds");

        delete nftListings[nftContract][tokenId];

        payable(listing.seller).transfer(msg.value);

        IERC721 nft = IERC721(nftContract);
        nft.transferFrom(address(this), msg.sender, tokenId);

        emit NFTSold(nftContract, tokenId, msg.sender, listing.price);

    }

    function cancelListening(address nftContract, uint256 tokenId) external {
        Listening memory listing = nftListings[nftContract][tokenId];

        require(listing.seller == msg.sender, "only seller can cancel");

        delete nftListings[nftContract][tokenId];

        IERC721 nft = IERC721(nftContract);
        nft.transferFrom(address(this), msg.sender, tokenId);
        emit NFTListingCanceled(nftContract, tokenId, msg.sender);

    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        // payable(owner).transfer(balance);
        (bool success, ) = owner.call{value: balance}("");
        require(success);
        emit Withdraw(owner, balance);
    }


    function isListed(address nftContract, uint256 tokenId) external view returns (bool) {
        return nftListings[nftContract][tokenId].price > 0;
    }
        
}