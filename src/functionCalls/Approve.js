import { ethers } from "ethers";
import React, { useState } from "react";
  
const Approve = ({ approveToken , transferToken, approveStatus }) => {
  const [coinType, setCoinType] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <div>
      <ul style={{listStyleType:"none"}}>
        <li>
          <h3 style={{ display: "inline" }}>Coin Type: </h3>
          <input onChange={(env) => setCoinType(env.target.value)}></input>
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

      {approveStatus == true ? <button onClick={()=> transferToken(coinType,destination,amount)} >Transfer</button>:<button onClick={() => approveToken(coinType,destination,amount)}>Approve</button>}
    </div>
  );
};

export default Approve;
