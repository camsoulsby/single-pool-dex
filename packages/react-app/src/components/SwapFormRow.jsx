import React, { useState } from "react";

export default function SwapFormRow(props) {
  const valueChangeHandler = e => {
    // setFormValue(e.target.value);
    props.changeValueFunction(e.target.value);
  };

  const imgSrc = props.asset == "ether" ? "ethlogo.png" : "ballogo.png";
  const imgSymbol = props.asset == "ether" ? "ETH" : "BAL";

  return (
    <div className="form-row">
      <input
        type="number"
        step="0.01"
        placeholder="0.0"
        className="swap-row-input"
        value={props.value}
        onChange={e => valueChangeHandler(e)}
      ></input>
      <div className="swap-row-dropdown">
        <div className="currency-img">
          <img src={`../../images/${imgSrc}`} height="20px" />
        </div>
        <div className="currency-symbol">{imgSymbol}</div>
      </div>
    </div>
  );
}
