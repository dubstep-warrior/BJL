import React, { useState } from "react";
import { ethers } from "ethers";
import "./WalletCard.css";
import Approve from "./Approve";
import Web3 from 'web3';
import {
  selectABI,
  selectProvider,
  checkPoint,
  types,
} from "./ccBnBInterface/config";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.BinanceChain && window.BinanceChain.isMetaMask) {
      console.log("MetaMask Here!");

      window.BinanceChain
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
          return result;
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  //Approve Handler
  const approveHandler = async (_coinType, _destination, _amount) => {
    let web3 = new Web3(selectProvider(types.bsc));
    const tokenContractAddress = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"; //ChainLink
    const tokenContract = new web3.eth.Contract(
      selectABI(types.bsc),
      tokenContractAddress
    );
    const data = tokenContract.methods
      .approve(
        "0x222B9FBdA9E91073246927a1EeaC45c502c55932",
        web3.utils.toWei('20')
      )
      .encodeABI();

    const transactionParameters = {
      nonce: "0x00", // ignored by MetaMask
      gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
      gas: "0x2710", // customizable by user during MetaMask confirmation.
      to: _coinType, // Required except during contract publications.
      from: defaultAccount, // must match user's active address.
      data: data,
      chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    const txHash = await window.BinanceChain.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  };

  //Approve Token
  const approveToken = async (_coinType, _destination, _amount, account) => {};

  return (
    <div className="walletCard">
      <h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      {errorMessage}
      <Approve approveToken={approveHandler} />
    </div>
  );
};

export default WalletCard;
