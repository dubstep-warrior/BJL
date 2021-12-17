import {
  types,
  selectCheckPoint,
  selectCheckPointABI,
  selectProvider,
  selectForeignCoinType,
} from "./../config/config.js";
import Web3 from 'web3';

export const callBscReceive = (_from, _txnObj, privKey) => {
    const type = types.bsc;
    const provider = selectProvider(type);
    const web3 = new Web3(provider);
    const _privKey = privKey;
  
    const myAccount = web3.eth.accounts.wallet.add(_privKey);
  
    const bscCheckPointAddress = selectCheckPoint(type);
    const bscCheckPointABI = selectCheckPointABI(type);
  
    const bscCheckPoint = new web3.eth.Contract(
      bscCheckPointABI,
      bscCheckPointAddress
    );
  
    const txnObj = _txnObj;
    const wrapped = !txnObj.wrapped;
  
    const _coinType = selectForeignCoinType(
      _from,
      txnObj.coinType,
      txnObj.wrapped
    );
  
    //string memory _coinTypeName,string memory _coinTypeSymbol,bool _wrapped, address _recipient, uint _amount, bytes memory _signature
    const data = bscCheckPoint.methods
      .transferIn(
        txnObj.sender,
        _coinType,
        wrapped,
        txnObj.destination,
        txnObj.amount,
        txnObj.signature
      )
      .encodeABI();
  
    const txData = {
      gas: "8000000",
      gasPrice: web3.utils.toWei("10", "gwei"),
      from: myAccount.address,
      to: bscCheckPointAddress,
      data: data,
    };
  
    const signedTransaction = web3.eth.accounts.signTransaction(txData, _privKey);
    signedTransaction.then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
  
      sentTx.on("receipt", (receipt) => {
        console.log("receipt: ", receipt);
      });
  
      sentTx.on("error", (err) => {
        console.log(err.message);
      });
    });
  };