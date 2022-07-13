import { useBalance, useContractReader, useBlockNumber } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useTokenBalance } from "eth-hooks/erc/erc-20/useTokenBalance";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import SwapFormRow from "./SwapFormRow";

const contractName = "DEX";
const tokenName = "Balloons";

export default function SwapTab(props) {

  const [liquidityError, setLiquidityError] = useState(false);

  const tx = props.tx;

  const writeContracts = props.writeContracts;

  

  const contractAddress = props.readContracts[contractName].address;
  const tokenAddress = props.readContracts[tokenName].address;
  const contractBalance = useBalance(props.localProvider, contractAddress);

  const tokenBalance = useTokenBalance(props.readContracts[tokenName], contractAddress, props.localProvider);
  const tokenBalanceFloat = parseFloat(ethers.utils.formatEther(tokenBalance));
  const ethBalanceFloat = parseFloat(ethers.utils.formatEther(contractBalance));
  const liquidity = useContractReader(props.readContracts, contractName, "totalLiquidity");

  const [fromEth, setFromEth] = useState(true);
  const [currentEthValue, setCurrentEthValue] = useState("");
  const [currentBalloonsValue, setCurrentBalloonsValue] = useState("");
  const [ethFixed, setEthFixed] = useState(true);

  useEffect(() => {
    //runs when swap direction changes or text fields are changed to calculate prices

    updatePriceCalculations();
  }, [fromEth, ethFixed, currentEthValue, currentBalloonsValue]);

  const updatePriceCalculations = async () => {
    //calculate the floating price as required based on fromEth and ethFixed

    let fixedValue = ethFixed ? currentEthValue : currentBalloonsValue;

    //handle blank input box
    if (fixedValue == "") {
      setCurrentBalloonsValue("");
      setCurrentEthValue("");
      console.log("not calculating price with blank input");
    } else {
      let fixedValueInEther = ethers.utils.parseEther("" + fixedValue);
      let calculatedPrice = 0;
      if (fromEth) {
        if (ethFixed) {
          calculatedPrice = await props.readContracts[contractName].estimateEthToToken(fixedValueInEther);
        } else {
          try {
            calculatedPrice = await props.readContracts[contractName].estimateEthRequiredForTokens(fixedValueInEther);
            setLiquidityError(false);
          } catch (e) {
            console.log(e);
            console.log("not enough Ballons liquidity");

            setLiquidityError(true);
          }
        }
      } else {
        if (ethFixed) {
          try {
            calculatedPrice = await props.readContracts[contractName].estimateTokensRequiredForEth(fixedValueInEther);
            setLiquidityError(false);
          } catch (e) {
            console.log(e);
            console.log("not enough Eth liquidity");
            setLiquidityError(true);
          }
        } else {
          calculatedPrice = await props.readContracts[contractName].estimateTokenToEth(fixedValueInEther);
        }
      }
      let formattedPrice = (Math.round(ethers.utils.formatEther(calculatedPrice) * 100) / 100).toFixed(2);
      //the value should probably only be rounded in the UI rather than rounding the actual value
      ethFixed == true ? setCurrentBalloonsValue(formattedPrice) : setCurrentEthValue(formattedPrice);
    }
  };

  const switchDirection = e => {
    e.preventDefault();
    setFromEth(!fromEth);
    setLiquidityError(false);
    //not that this state update doesn't happen instantly - this caused some errors in console.log
    //this is where useEffect will be used to calculate what values should be used, rather than calculating just when I change numbers in the inputs
  };
  const handleSwapButton = e => {
    e.preventDefault();
    let zeroError = false;
    if (currentEthValue == 0 || currentEthValue == "") {
      zeroError = true;
    }
    if (!liquidityError & !zeroError) {
      fromEth == true ? swapEthToToken(currentEthValue) : swapTokenToEth(currentBalloonsValue);
    }
  };

  const swapEthToToken = async value => {
    console.log("Swapping...");
    let valueInEther = ethers.utils.parseEther("" + value);
    let swapEthToTokenResult = await tx(writeContracts[contractName]["ethToToken"]({ value: valueInEther }));
    console.log("swapEthToTokenResult:", swapEthToTokenResult);
  };

  const swapTokenToEth = async value => {
    let valueInEther = ethers.utils.parseEther("" + value);
    console.log("valueInEther", valueInEther);
    let allowance = await props.readContracts[tokenName].allowance(
      props.address,
      props.readContracts[contractName].address,
    );
    console.log("allowance", allowance);

    let approveTx;
    if (allowance.lt(valueInEther)) {
      approveTx = await tx(
        writeContracts[tokenName].approve(props.readContracts[contractName].address, valueInEther, {
          gasLimit: 200000,
        }),
      );
    }

    let swapTx = tx(writeContracts[contractName]["tokenToEth"](valueInEther, { gasLimit: 200000 }));
    if (approveTx) {
      console.log("waiting on approve to finish...");
      let approveTxResult = await approveTx;
      console.log("approveTxResult:", approveTxResult);
    }
    let swapTxResult = await swapTx;
    console.log("swapTxResult:", swapTxResult);
  };

  const theme = window.localStorage.getItem("theme");

  //handle change of text in ETH input
  const setEthValue = value => {
    // if (value == "") {
    //   value = 0.00;
    // }
    setCurrentEthValue(value);
    setEthFixed(true);
  };

  //handle change of text in ballons input
  const setBaloonsValue = value => {
    // if (value == "") {
    //   value = 0.00;
    // }
    setCurrentBalloonsValue(value);
    setEthFixed(false);
  };

  return (
    <div className="simple-ui-card">
      <h1>Swap</h1>
      <div className="form-group">
        <SwapFormRow
          asset={fromEth ? "ether" : "balloons"}
          changeValueFunction={fromEth ? setEthValue : setBaloonsValue}
          value={fromEth ? currentEthValue : currentBalloonsValue}
        />

        <button onClick={e => switchDirection(e)} id="swap-direction-button">
          ⬇
        </button>

        <SwapFormRow
          asset={fromEth ? "balloons" : "ether"}
          changeValueFunction={fromEth ? setBaloonsValue : setEthValue}
          value={fromEth ? currentBalloonsValue : currentEthValue}
        />
        <button
          onClick={e => handleSwapButton(e)}
          id="execute-swap-button"
          style={{ background: `${liquidityError ? "red" : "green"}` }}
        >
          {liquidityError ? "Not enough liquidity" : "Swap"}
        </button>
      </div>
    </div>
  );
}
