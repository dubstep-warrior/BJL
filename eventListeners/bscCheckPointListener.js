import {
  types,
  selectWssProvider,
  selectCheckPoint,
  selectCheckPointABI,
  selectProvider,
  selectForeignCoinType,
} from "./../src/config/config.js";
import Web3 from "web3";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("You are the admin, please enter private key: ", (res) => {
  if (res.length == 64) {
    rl.close();
    startListener(res);
  } else {
    rl.close();
    console.log("Invalid private key");
  }
});

const startListener = (res) => {
  const privKey = res;
  console.log("Valid private key, starting event listener..");
  let type = types.bsc;

  let wss = selectWssProvider(type);
  let provider = new Web3.providers.WebsocketProvider(wss);
  let web3 = new Web3(provider);

  provider.on("error", (e) => {
    console.error("WS Infura Error", e);
  });

  provider.on("end", (e) => {
    console.log("WS closed");
    console.log("Attempting to reconnect...");
    provider = new Web3.providers.WebsocketProvider(wss);
    provider.on("connect", function () {
      console.log("WSS Reconnected");
    });
    web3.setProvider(provider);
  });

  const contractAddress = selectCheckPoint(type);
  console.log("Contract Address: ", contractAddress);
  const contractABI = selectCheckPointABI(type);

  const bscCheckPoint = new web3.eth.Contract(contractABI, contractAddress);

  //Listen Transfer Events
  console.log("listening...");
  bscCheckPoint.events.Transfer(
    {
      fromBlock: "latest",
    },
    function (error, event) {
      console.log("listening again...");
      if (event) {
        const txnObj = event.returnValues;
        console.log("Transfer Event:", txnObj);
        console.log(txnObj.sender, txnObj.wrapped);

        
        callEthReceive(type, txnObj, privKey);
      } else {
        console.log("Error", error);
      }
    }
  );
};

const callEthReceive = (_from, _txnObj, privKey) => {
  const type = types.eth;
  const provider = selectProvider(type);
  const web3 = new Web3(provider);
  const _privKey = privKey;

  const myAccount = web3.eth.accounts.wallet.add(_privKey);

  const ethCheckPointAddress = selectCheckPoint(type);
  const ethCheckPointABI = selectCheckPointABI(type);

  const ethCheckPoint = new web3.eth.Contract(
    ethCheckPointABI,
    ethCheckPointAddress
  );

  const txnObj = _txnObj;
  const wrapped = !txnObj.wrapped;

  const _coinType = selectForeignCoinType(
    _from,
    txnObj.coinType,
    txnObj.wrapped
  );

  //string memory _coinTypeName,string memory _coinTypeSymbol,bool _wrapped, address _recipient, uint _amount, bytes memory _signature
  const data = ethCheckPoint.methods
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
    to: ethCheckPointAddress,
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
