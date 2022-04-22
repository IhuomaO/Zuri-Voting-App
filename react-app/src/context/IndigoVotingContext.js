import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { contractABI, contractAddress } from "utils/constants";

export const IndigoVotingContext = React.createContext();

const { ethereum } = window;

let contractValue;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  console.log(contractABI);
  const indigoVotingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({ provider, signer, indigoVotingContract });
  return indigoVotingContract;
};

export const IndigoVotingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const history = useHistory();
  const chechIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return toast.warning("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
      console.log(accounts);
    } catch (error) {
      toast.warning(`${error.response}`);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return toast.warning("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      history.push("/auth/dashboard");
      setCurrentAccount(accounts[0]);
      localStorage.setItem("account", accounts[0]);
      console.log(accounts[0]);
      contractValue = getEthereumContract();
    } catch (error) {
      toast.warning(`${error.response}`);
    }
  };
  useEffect(() => {
    chechIfWalletIsConnected();
  }, []);

  return (
    <IndigoVotingContext.Provider
      value={{ connectWallet, currentAccount, contractValue }}
    >
      {children}
    </IndigoVotingContext.Provider>
  );
};
