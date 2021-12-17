import React, { useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  types,
  selectABI,
  selectCheckPoint,
  selectProvider,
} from "./../config/config.js";



export const approveToken = async (_coinType, _destination, _amount, _from) => {
  if (window.ethereum.isConnected()) {
    console.log("yes connected", _coinType, _destination, _amount);

    let type = _from;
    let provider = selectProvider(type);
    let web3 = new Web3(provider);
    const tokenContractAddress = _coinType;
    const tokenABI = selectABI(type);

    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    const data = tokenContract.methods
      .approve(selectCheckPoint(type), web3.utils.toWei(_amount))
      .encodeABI();

    const transactionParameters = {
      nonce: "0x00", // ignored by MetaMask
      gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
      gas: web3.utils.toHex("30000"), // customizable by user during MetaMask confirmation.
      to: _coinType, // Required except during contract publications.
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
  } else {
    console.log("not connected");
    return false;

  }
};

//check Approved allowance;
export const checkApproved = (_coinType) => {
  let type = types.eth;
  let provider = selectProvider(type);
  let web3 = new Web3(provider);
  const tokenContractAddress = _coinType;
  const tokenABI = selectABI(type);

  const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);
  if (window.ethereum.isConnected()) {
    console.log(
      "is connected to check:" +
        window.ethereum.selectedAddress +
        "| " +
        selectCheckPoint(type)
    );
    tokenContract.methods
      .allowance(window.ethereum.selectedAddress, selectCheckPoint(type))
      .call({
        from: window.ethereum.selectedAddress,
      })
      .then((error, result) => {
        if (result) {
          console.log("Approved amount:", result);
          return true;
        }
        if (error) {
          console.log(error);
          return false;
        }
      });
  } else {
    console.log("not connected to metamask");
    return false;
  }
};

 