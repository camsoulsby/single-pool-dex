import React, { useState, useEffect } from "react";
import SwapTab from "./SwapTab";
import PoolTab from "./PoolTab";
import { Button, Col, Menu, Row, List } from "antd";
import { Redirect, Link, Route, Switch, useLocation, useHistory, useRouteMatch } from "react-router-dom";

const Tabs = props => {
  const [activeTab, setActiveTab] = useState("swap");

//when the route changes, update the active tab state variable to ensure that the correct tab is highlighted
  let match = useRouteMatch("/app/:page");
  useEffect(() => { //runs when path changes
  
    if (match == null) { // handle /app/ case
      setActiveTab("swap");
    } else {
    setActiveTab(match.params.page);
  }
  }, [match]); 

  //  Functions to handle Tab Switching
  const handleSwapTab = () => {
    // update the state to tab1
    setActiveTab("swap");
  };
  const handlePoolTab = () => {
    // update the state to tab2
    setActiveTab("pool");
  };


  const tx = props.tx;
  const writeContracts = props.writeContracts;
  const localProvider = props.localProvider;
  const mainnetProvider = props.mainnetProvider;
  const blockExplorer = props.blockExplorer;
  const address = props.address;
  const readContracts = props.readContracts;
  const contractConfig = props.contractConfig;
  const userSigner = props.signer;
  const price = props.price;
  const yourLocalBalance = props.yourLocalBalance;

  //do this better
const ifPoolTabActive = (activeTab == "pool") ? "activeTab" : "";
const ifSwapTabActive = (activeTab == "swap") ? "activeTab" : "";

  return (
    <div className="tabs">
      <div className="tabNav">
        <Link to="/app/swap">
        <span onClick={handleSwapTab}>
          <div className= {"tabNavItem " + ifSwapTabActive}>
            <p>Swap</p>
          </div>
        </span>
        </Link>

        <Link to="/app/pool">
        <span onClick={handlePoolTab}>
          <div className= {"tabNavItem "  + ifPoolTabActive}>
            <p>Pool</p>
          </div>
        </span>
        </Link>
      </div>

      <Switch>
        <Route exact path="/app">
          <Redirect to="/app/swap" />
        </Route>
        <Route path="/app/swap">
          <SwapTab
            tx={tx}
            writeContracts={writeContracts}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address} //this is causing issues
            readContracts={readContracts} //this is causing issues
            contractConfig={contractConfig}
            signer={userSigner}
            price={price}
            yourLocalBalance= {yourLocalBalance}
          />
        </Route>
        <Route path="/app/pool">
          <PoolTab 
           tx={tx}
           writeContracts={writeContracts}
           localProvider={localProvider}
           mainnetProvider={mainnetProvider}
           blockExplorer={blockExplorer}
           address={address} //this is causing issues
           readContracts={readContracts} //this is causing issues
           contractConfig={contractConfig}
           signer={userSigner}
           price={price}
           />
        </Route>
      </Switch>
    </div>
  );
};
export default Tabs;
