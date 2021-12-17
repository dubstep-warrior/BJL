// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


interface IBEP20 {
  function balanceOf(address owner) external view returns (uint);
  function approve(address spender, uint value) external returns (bool);
  function transfer(address to, uint value) external payable returns (bool);
  function transferFrom(address from, address to, uint value) external payable returns (bool);
}

contract BscBJLToken is IBEP20 {

    string public name;
    string public symbol;
    address public _owner;
    address public _self;
    uint8 public constant decimals = 18;


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Deposit(address indexed from, uint tokens);
    event Withdraw(address indexed to, uint tokens);


    mapping(address => uint) balances;
    mapping(address => mapping (address => uint)) allowed;

    constructor(string memory _name, string memory _symbol) {
        name = string(abi.encodePacked("BJL WRAPPED: ",_name));
        symbol = string(abi.encodePacked("W",_symbol));
        _self = address(this);
        _owner = msg.sender;
     }

    modifier _onlyOwner(){
        require(msg.sender == _owner, "You are not the owner");
        _;
    }


    function getName() external view returns (string memory) {
        return name;
    }

    function getSymbol() external view returns (string memory) {
        return symbol;
    }

    function totalSupply() public view returns (uint) {
        return address(this).balance;
    }

    function balanceOf(address tokenOwner) public override view returns (uint) {
        return balances[tokenOwner];
    }

    function balanceOf() public view returns (uint) {
        return balances[address(msg.sender)];
    }

    function transfer(address receiver, uint numTokens) public override payable returns (bool) {
        return transferFrom(msg.sender, receiver, numTokens);
    }

    function approve(address delegate, uint numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function transferFrom(address owner, address buyer, uint numTokens) public override payable returns (bool) {
        require(numTokens <= balances[owner], "Account not enough money");

        balances[owner] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }


    function mint(address recipient, uint amount) public _onlyOwner {
        balances[recipient] += amount;
        emit Deposit(recipient, amount);
    }

    function burn(uint amount, address _sender) public _onlyOwner {
        balances[_sender] -= amount;
        payable(_sender).transfer(amount);
        emit Withdraw(_sender, amount);
    }

    function empty() public payable {
        uint total = balances[msg.sender];
        payable(msg.sender).transfer(total);
        emit Withdraw(msg.sender, total);
        balances[msg.sender] = 0;
    }
}
