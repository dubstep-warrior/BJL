import { ethers } from "ethers";
import { types } from "./../config/config.js";
import React, { useState } from "react";

const Approve = ({ approveToken, transferToken, approveStatus }) => {
  const [coinType, setCoinType] = useState("0x0d82DE7c90D308EA2998a5581633220dC9579754");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState(types.eth);

  return (
    <div>
      <div className="selectFrom">
        <div style={{ display: "inline" }}>From: </div>
        <select
          name="bc"
          id="bc"
          onChange={(env) => setFrom(env.target.value)}
        >
          <option value={types.eth}>Ethereum</option>
          <option value={types.bsc}>Binance</option>
        </select>
      </div>

      <ul style={{ listStyleType: "none" }}>
        <li>
        <h3 style={{ display: "inline" }}>Coin Type: </h3>
        {from == types.eth ? <select
          name="coin"
          id="coin"
          onChange={(env) => setCoinType(env.target.value)}
        >
          <option value='0x0d82DE7c90D308EA2998a5581633220dC9579754'>Token A</option>
          <option value='xxx'>---</option>
         </select> : <select
          name="coin"
          id="coin"
          onChange={(env) => setCoinType(env.target.value)}
        >
          <option value='0xF99Ec87244591eD8334e4C3f44b06C4F7C7386bf'>Wrapped Token A</option>
          <option value='xxx'>---</option>
         </select>}
        </li>
        <li>
          <h3 style={{ display: "inline" }}>Destination: </h3>
          <input onChange={(env) => setDestination(env.target.value)}></input>
        </li>
        <li>
          <h3 style={{ display: "inline" }}>Amount: </h3>
          <input onChange={(env) => setAmount(env.target.value)}></input>
        </li>
      </ul>

      {approveStatus == true ? (
        <button
          onClick={() => transferToken(coinType, destination, amount, from)}
        >
          Transfer
        </button>
      ) : (
        <button
          onClick={() => approveToken(coinType, destination, amount, from)}
        >
          Approve
        </button>
      )}
    </div>
  );
};

export default Approve;
