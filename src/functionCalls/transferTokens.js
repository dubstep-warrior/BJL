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

export const transferTokens = async (
  _coinType,
  _destination,
  _amount,
  _from
) => {
  console.log(
    "Transferring: "+ _from + " | " + _coinType + " | " + _destination + " | " + _amount
  );

  let type = _from;
  let provider = selectProvider(type);
  let web3 = new Web3(provider);
  let checkPointAddress = selectCheckPoint(type);
  let checkPointABI = selectCheckPointABI(type);

  const checkPointContract = new web3.eth.Contract(
    checkPointABI,
    checkPointAddress
  );

  const tokenContractAddress = _coinType;
  const tokenABI = selectABI(type);
  const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

  tokenContract.methods
    .name()
    .call()
    .then((result) => {
      console.log(result);
      const tokenName = result;
      tokenContract.methods
        .symbol()
        .call()
        .then((result) => {
          console.log(result);
          const tokenSymbol = result;
          continueTxn(tokenName, tokenSymbol);
        });
    });

  const continueTxn = async (tokenName, tokenSymbol) => {
    //Hashing transaction message

    const txHash = web3.utils
      .soliditySha3(
        { t: "address", v: window.ethereum.selectedAddress },
        { t: "address", v: _coinType },
        { t: "address", v: _destination },
        { t: "uint", v: _amount }
      )
      .toString("hex");

    //Constructing digital signature
    let _digSignature = await window.ethereum
      .request({
        method: "personal_sign",
        params: [txHash, window.ethereum.selectedAddress],
      })
      .then((result) => {
        console.log(result);
        return result;
      });

    _digSignature =
      _digSignature.substr(0, 130) +
      (_digSignature.substr(130) == "00" ? "1b" : "1c");

    const data = checkPointContract.methods
      .transferOut(
        _coinType,
        _destination,
        web3.utils.toWei(_amount),
        _digSignature
      )
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

    const txn = await window.ethereum
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
};

// export const signTxn = async () => {

//   let txnHash = await window.ethereum
//     .request({
//       method: "personal_sign",
//       params: [ "hello World its bj!", window.ethereum.selectedAddress],
//     })
//     .then((result) => {
//       console.log(result);
//       return result;
//     });

//  };
