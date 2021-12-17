import { ethers } from "ethers";
import "./App.css";
import React, { useState, useEffect } from "react";
import { approveToken, checkApproved } from "./functionCalls/approveToken";
import { transferTokens } from "./functionCalls/transferTokens";
import Approve from "./functionCalls/Approve";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
          setErrorMessage(null);
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
    setDefaultAccount("");
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const approveHandler = async (_coinType, _destination, _amount ,_from) => {
    setSelectedToken(_coinType);
    if (approveToken(_coinType, _destination, _amount, _from)) {
      setApproveStatus(true);
    } else {
      setApproveStatus(false);

      return;
    }
  };

 
  const [selectedToken, setSelectedToken] = useState("");
  const [approveStatus, setApproveStatus] = useState(false);
 
  const transferHandler = async (_coinType, _destination, _amount , _from) => {
    if (selectedToken != _coinType) {
      setSelectedToken(_coinType);
    } else {
      transferTokens(_coinType, _destination, _amount, _from);
    }
  };


  useEffect(() => {
    setApproveStatus(false);
  }, [selectedToken]);

   

 


  return (
    <div className="App">
      <div className="container">
        {!defaultAccount ? (
          <button className="connectBtn" onClick={connectHandler}>
            Connect
          </button>
        ) : null}
        {errorMessage != null ? <p>Error: {errorMessage}</p> : null}
        <p>Address: {defaultAccount}</p>
        <p>Balance: {userBalance}</p>
        <p>{connButtonText}</p>
        {defaultAccount ? (
          <Approve
            approveToken={approveHandler}
            approveStatus={approveStatus}
            transferToken={transferHandler}
          />
        ) : null}
         </div>
    </div>
  );
}

export default App;
