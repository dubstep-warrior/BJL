import {types, selectWssProvider, selectCheckPoint, selectCheckPointABI} from "./../src/config/config.js";
import Web3 from "web3";

let type = types.eth;

 
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
console.log("Contract Address: ", contractAddress)
const contractABI = selectCheckPointABI(type);

const ethCheckPoint = new web3.eth.Contract(contractABI, contractAddress);

//Listen Transfer Events
console.log("listening...");
ethCheckPoint.events.Transfer(
  {
    fromBlock: "latest",
  },
  function (error, event) {
    console.log("listening again...");
    if (event) {
		const txnObj = event.returnValues._txnObj;
      console.log("Transfer Event:", txnObj);
	// console.log("sender index: ",typeof(txnObj), txnObj.sender, txnObj.wrapped);
      // callBscReceive(txnObj);
    } else {
      console.log("Error", error);
    }
  }
);

// const callBscReceive = (_txnObj) => {
// 	const txnObj = _txnObj;
// 	txnObj.wrapped = true;
// 	contract.methods.transferIn(txnObj).send({
// 		gas: "800000",
// 		// gasPrice: web3.utils.toWei("10", "gwei"),
// 		from: myAccount.address,
//  	  })
// 	.on('receipt', function(receipt){
// 		console.log(receipt)
// 	})
	 
// }
 
 
