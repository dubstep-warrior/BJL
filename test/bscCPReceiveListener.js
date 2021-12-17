import {types, selectWssProvider, selectCheckPoint, selectCheckPointABI} from "../src/config/config.js";
import Web3 from "web3";

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
console.log("Contract Address: ", contractAddress)
const contractABI = selectCheckPointABI(type);

const bscCheckPoint = new web3.eth.Contract(contractABI, contractAddress);

//Listen Transfer Events
console.log("listening...");
bscCheckPoint.events.Receive(
  {
    fromBlock: 0,
  },
  function (error, event) {
    console.log("listening again...");
    if (event) {
		const txnObj = event.returnValues;
      console.log("Receive Event:", txnObj);
	// console.log("sender index: ",typeof(txnObj), txnObj.sender, txnObj.wrapped);
     } else {
      console.log("Error", error);
    }
  }
);

 
 
 
