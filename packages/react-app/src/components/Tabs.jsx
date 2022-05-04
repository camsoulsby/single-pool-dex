import React, { useState }  from "react";
import SwapTab from "./SwapTab";
import PoolTab from "./PoolTab";


const Tabs = () => {

    const [activeTab, setActiveTab] = useState("swap");

      //  Functions to handle Tab Switching
  const handleSwapTab = () => {
    // update the state to tab1
    setActiveTab("swap");
  };
  const handlePoolTab = () => {
    // update the state to tab2
    setActiveTab("pool");
  };

    return (
      
    <div className="Tabs">

    {/* Tab nav */}
    <ul className="nav">
      <li className={activeTab ==="swap" ? "active" : ""} onClick={handleSwapTab}>Swap</li>
      <li className={activeTab === "pool" ? "active" : ""}onClick={handlePoolTab}>Pool</li>
    </ul>
    <div className="outlet">
    {activeTab === "swap" ? <SwapTab /> : <PoolTab />}

    </div>
  </div>
    );
};
export default Tabs;