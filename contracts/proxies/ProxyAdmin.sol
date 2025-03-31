pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract ProxyAdminCustom is ProxyAdmin{
    
   constructor (address initialOwner) ProxyAdmin(initialOwner) {
       
   }
}