// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "hardhat/console.sol";
contract MultiSig {

   struct Transaction {
        address payable spender;
        uint amount;
        uint numberOfApprovals;
        bool isActive;
    }

    address[] Admins;
    uint transactionId;
    uint256 requiredNumberOfApprovals;


    mapping(address => bool) isAdmin;
    mapping(uint => Transaction) transaction;
    mapping(uint => mapping(address => bool)) isApproved;

    error InvalidAddress(uint position);
    error InvalidAdminNumber(uint number);
    error DuplicateAddress(address _addr);

    event CreateTransaction(address indexed creator, address indexed spender, uint amount, uint256 transactionId);
    event Deposit(address indexed sender, uint amount, uint balance);
    event SendTransaction(uint indexed transactionId, uint256 amount);
    event RevokeTransaction(uint indexed _transactionId, address revoker);

    modifier onlyAdmin(){
        require(isAdmin[msg.sender], "invalid admin");
        _;
    }

    constructor(address[] memory _admins, uint256 _numbersOfConfirmation) payable {
        

        if (_admins.length > _numbersOfConfirmation ){
            revert InvalidAdminNumber(_numbersOfConfirmation);
        }
       

        for (uint i = 0; i < _admins.length; i++){
            if (_admins[i] == address(0)){
                revert InvalidAddress(i + 1);
            }

            if (isAdmin[_admins[i]]){
                revert DuplicateAddress(_admins[i]);
            }

            isAdmin[_admins[i]] = true;
        }
        requiredNumberOfApprovals = _numbersOfConfirmation;
        Admins = _admins;
    }

    function createTransaction( address _spender) external payable onlyAdmin {
        require(msg.value < address(this).balance, "Invalid transaction amount");
        transactionId++;
        Transaction storage _transaction = transaction[transactionId];
        _transaction.amount = msg.value;
        _transaction.spender = payable(_spender);
        _transaction.isActive = true;
        emit CreateTransaction(msg.sender, _spender, msg.value, transactionId);
        approveTransaction(transactionId);
    }


    function approveTransaction(uint _transactionId) public onlyAdmin{
        require(isApproved[_transactionId][msg.sender] == false, "Transaction already approved");
        Transaction storage _transaction = transaction[_transactionId];
        require(_transaction.isActive, "transaction not active");
        isApproved[_transactionId][msg.sender] = true;
        _transaction.numberOfApprovals+=1;

        uint minApprovals = getMinApprovals();
       
        if(minApprovals <= _transaction.numberOfApprovals){
            sendTransaction(_transactionId);
        }

    }

    function sendTransaction(uint _transactionId) private onlyAdmin{
            Transaction storage _transaction = transaction[_transactionId];
            (bool success, ) = _transaction.spender.call{value: _transaction.amount}("");
            require(success, "transaction failed");
            emit SendTransaction(transactionId, _transaction.amount);
            _transaction.isActive = false;
    }

    function revokeApproval(uint _transactionId) public onlyAdmin{
          
            Transaction storage _transaction = transaction[_transactionId];
            
            require(_transaction.isActive, "Transaction not active");
            require(isApproved[_transactionId][msg.sender] == true, "Transaction not approved by sender");
            _transaction.numberOfApprovals-=1;
            isApproved[_transactionId][msg.sender] = false;
            emit RevokeTransaction(_transactionId, msg.sender);
    }

    function getTransaction(uint _transactionId) public view returns(Transaction memory t){
        return transaction[_transactionId];
    }

    function getOwners() public view returns(address[] memory){
        return Admins;
    }

    receive() external payable {
       emit Deposit(msg.sender, msg.value, address(this).balance);
   }

    function getMinApprovals() private view returns(uint){
        return requiredNumberOfApprovals;
    }

   
}