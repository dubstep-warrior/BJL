import React, { useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  types,
  selectABI,
  selectCheckPoint,
  selectProvider,
  selectCheckPointABI,
} from "./../config/config.js";

export const transferTokens = async (_coinType, _destination, _amount) => {
  console.log(
    "Transferring: " + _coinType + " | " + _destination + " | " + _amount
  );

  let type = types.eth;
  let provider = selectProvider(type);
  let web3 = new Web3(provider);
  let checkPointAddress = selectCheckPoint(type);
  let checkPointABI = selectCheckPointABI(type);

  const checkPointContract = new web3.eth.Contract(
    checkPointABI,
    checkPointAddress
  );

  const data = checkPointContract.methods
    .transferOut(_coinType, _destination, web3.utils.toWei(_amount))
    .encodeABI();

  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
    gas: web3.utils.toHex("100000"), // customizable by user during MetaMask confirmation.
    to: checkPointAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: data, // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  const txHash = await window.ethereum
    .request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })
    .then((result) => {
      // The result varies by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
      console.log(result);
      return true;
    })
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      console.log(error);
      return false;
    });
};
