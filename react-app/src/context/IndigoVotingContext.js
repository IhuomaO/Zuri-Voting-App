import React, { useEffect, useState, createContext, useContext } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { contractABI, contractAddress } from "utils/constants";

export const IndigoVotingContext = createContext();

const { ethereum } = window;


const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return contract;
};

export const useStoreContext = () => useContext(IndigoVotingContext)

export const IndigoVotingProvider = ({ children }) => {
  const [store, setStore] = useState({
    currentAccount: null,
    contract: getEthereumContract(),
    connectWallet: null,
    contractDetails: {},
  })
  const setStoreContext = (state) => setStore({ ...store, ...state })

  const history = useHistory();


  const connectWallet = async (redirect) => {
    try {
      if (!ethereum) return toast.warning("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      localStorage.setItem("account", accounts[0]);
      console.log(localStorage.getItem("account"));
      redirect && history.push("/auth/dashboard");
      // setStoreContext({ currentAccount: accounts[0] });
    } catch (error) {
      console.log(`${error.response}`);
    }
  };


  const checkIfWalletIsConnected = async () => {
    try {
      // if (!ethereum) return toast.warning("Please install metamask");

      // const accounts = await ethereum.request({ method: "eth_accounts" });

      // if (accounts.length) setStoreContext({ currentAccount: accounts[0] });
      // console.log(accounts);
      connectWallet();
      console.log('active');

      const { contract } = store

      setStoreContext({
        connectWallet,
        currentAccount: localStorage.getItem('account'),
        contractDetails: {
          totalVoters: await contract.getTotalVoter(),
          owner: await contract.owner(),
          chairman: await contract.chairman(),
          isTeacher: await contract.isTeacher(store.currentAccount),
          isStudent: await contract.isStudent(store.currentAccount),
          isBODMember: await contract.isBODMember(store.currentAccount),
          isStakeHolder: await contract.isStakeHolder(store.currentAccount),
          // bod: await contract.BOD(store.currentAccount),
          // candidateDetails: contract.candidateDetails(),


        }
      })
    } catch (error) {
      toast.warning(`${error.response}`);
    }
  };



  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line
  }, []);

  console.log('last', store);



  return (
    <IndigoVotingContext.Provider
      value={{ store, setStoreContext }}
    >
      {children}
    </IndigoVotingContext.Provider>
  );
};

