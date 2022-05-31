import React, {useState} from "react";

export default function SwapFormRow(props) {

    const [formValue, setFormValue] = useState(0);

    const valueChangeHandler = e => {
        setFormValue(e.target.value);

    }

    
  return (
    <div className="form-row">
      <input type="text" className="swap-row-amount" value={formValue} onChange={e => valueChangeHandler(e)}></input>
      <div className="swap-row-dropdown">
        <div className="currency-img">
          <img src="../../images/ethlogo.png" height="20px"/>
        </div>
        <div>{props.asset}</div>
      </div>
    </div>
  );
}
