//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./EthBJLToken.sol";

contract EthTokenPool {
    // IBEP20 public token;
     address public _owner;

      modifier onlyOwner(){
        require(msg.sender == _owner , "You are not the owner of EthTokenPool");
        _;
    }

    // Mapping of tokenPools
    mapping(address => IERC20) coinPoolMap;
    mapping(address => bool) coinPoolMapExists;

    //Maps a token address to whether it is minted or not
    mapping(address => bool) mintedTokens;
    event CreatedTokenContract(address tokenAddress);

    function checkMapping(address _coinType) internal{
        if(!coinPoolMapExists[_coinType]){
            coinPoolMap[_coinType] = IERC20(_coinType);
            coinPoolMapExists[_coinType] = !coinPoolMapExists[_coinType];
        }
    }

    function deposit(uint _amount, address _coinType) internal {
        coinPoolMap[_coinType].transferFrom(msg.sender, address(this), _amount);
      }

      //transfer native token to the contract pool
     function withdrawNative(address _coinType,address _address,uint _amount) internal {
        coinPoolMap[_coinType].transferFrom(address(this), _address, _amount);
     }


     //transfer native token transfer from the contract pool
     function withdrawForeign(address _coinType,address _recipient, uint _amount) internal returns(address) {
        mintedTokens[_coinType] = true;
        EthBJLToken(_coinType).mint(_recipient, _amount);

        return EthBJLToken(_coinType)._self();
     }

     function createTokenContract(string memory _name, string memory _symbol) public onlyOwner {
         EthBJLToken tokenContract = new EthBJLToken(_name,_symbol);
         emit CreatedTokenContract(tokenContract._self());
     }



}
