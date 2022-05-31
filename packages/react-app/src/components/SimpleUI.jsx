import { PropertySafetyTwoTone } from "@ant-design/icons";
import React from "react";
import Tabs from "./Tabs";

export default function SimpleUI(props) {
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

    return (
      

   
    <div className="simpleUI">
      <Tabs 
       tx={tx}
       writeContracts={writeContracts}
       localProvider={localProvider}
       mainnetProvider={mainnetProvider}
       blockExplorer={blockExplorer}
       address={address} //this is causing issues
       readContracts={readContracts} //this is causing issues
       contractConfig={contractConfig}
       signer={userSigner}
       price={price}/>
    </div>
  );
}
