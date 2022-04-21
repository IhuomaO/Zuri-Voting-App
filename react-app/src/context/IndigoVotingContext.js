import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { contractABI, contractAddress } from "utils/constants";

export const IndigoVotingContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const indigoVotingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({ provider, signer, indigoVotingContract });
};

export const IndigoVotingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
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
      setCurrentAccount(accounts[0]);
    } catch (error) {
      toast.warning(`${error.response}`);
    }
  };
  useEffect(() => {
    chechIfWalletIsConnected();
  }, []);

  return (
    <IndigoVotingContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </IndigoVotingContext.Provider>
  );
};
