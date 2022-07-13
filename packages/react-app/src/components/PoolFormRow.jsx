import React, { useState } from "react";
import {Button} from "antd";


export default function PoolFormRow(props) {
  const valueChangeHandler = e => {
    props.changeValueFunction(e.target.value);
  };

  const approvalHandler = () => {
    props.approvalFunction(props.value);
   
  };
  const executeHandler = () => {
    props.executeFunction(props.value);
  };

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
      
     
      {props.approvalNeeded ? <input type="button" disabled={props.value == 0} value="Approve" onClick={approvalHandler}/>: <input type="button" disabled={props.value == 0} value={props.buttonLabel} onClick={executeHandler}/>}
  
    </div>
  );
}
