 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./BscTokenPool.sol";



contract CCBscPoint is BscTokenPool{


    //Events
    event Transfer(address sender , bool wrapped , address coinType , address destination , uint amount, bytes signature);
    event Receive(address _sender,address _coinType,address _recipient,uint _amount,address foreignAddress, address recovered);

    constructor() {
        _owner = msg.sender;
     }

    function transferOut(address _coinType,address _destination,uint _amount , bytes calldata _signature) public {
        //Initializes Transaction Object
         address _sender = msg.sender;
         bool _wrapped;

        //checks if transferred token is wrapped version or not
        if(mintedTokens[_coinType]){
            //burn
            IBEP20(_coinType).transferFrom(msg.sender, address(this), _amount);

            //Build Transaction Object
            _wrapped = true;
        }else{
            //Check tokenPool exists for token
            checkMapping(_coinType);
            // amount should be > 0
            require(_amount > 0, "amount should be > 0");
            deposit(_amount, _coinType);
            _wrapped = false;
        }
        emit Transfer(_sender,_wrapped, _coinType, _destination ,_amount , _signature);
    }

    function transferIn(address _sender, address _coinType,bool _wrapped, address _recipient, uint _amount, bytes memory _signature) public onlyOwner {
        // Authenticate
        //Compute txHash
        bytes32 txHash = prefixed(keccak256(abi.encodePacked(_sender,_coinType,_recipient,_amount)));
        address recovered = recoverSigner(txHash, _signature);
        //Check Wrapped
        address foreignAddress;
        if(_wrapped){
            //Mint Tokens
            foreignAddress = withdrawForeign(_coinType,_recipient, _amount);
        }else{
            withdrawNative(_coinType,_recipient, _amount);
        }
        emit Receive(_sender,_coinType,_recipient,_amount,foreignAddress, recovered);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32){
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",hash));
    }

    function recoverSigner(bytes32 txHash , bytes memory signature)internal pure returns (address){
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v,r,s) = splitSignature(signature);

        return ecrecover(txHash,v,r,s);
    }

    function splitSignature(bytes memory signature) internal pure returns(uint8,bytes32,bytes32){
        require(signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature,32))
            s := mload(add(signature,64))
            v := byte(0,mload(add(signature, 96)))
        }

        return (v, r, s);
    }

}
