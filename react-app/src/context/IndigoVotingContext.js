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


  const connectWallet = async () => {
    try {
      if (!ethereum) return toast.warning("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      localStorage.setItem("account", accounts[0]);
      // console.log(localStorage.getItem("account"));
      // history.push("/auth/dashboard");
      setStoreContext({ currentAccount: accounts[0] });

      const { contract, currentAccount } = store
      setStoreContext({
        ...store,
        connectWallet,
        currentAccount: localStorage.getItem("account"),
        test: 'trying',
        contractDetails: {
          candidateDetails: await contract.electionDetails(),
          owner: await contract.owner(),
          // totalVoters: await contract.getTotalVoter(),
          // chairman: await contract.chairman(),
          // isTeacher: await contract.isTeacher(currentAccount),
          // isStudent: await contract.isStudent(currentAccount),
          // isBODMember: await contract.isBODMember(currentAccount),
          // isStakeHolder: await contract.isStakeHolder(currentAccount),
          // bod: await contract.BOD(store.currentAccount),
          // candidateDetails: contract.candidateDetails(),
        }
      })

    } catch (error) {
      console.log(`${error.response}`);
    }
  };


  const checkIfWalletIsConnected = () => {
    // try {
    // if (!ethereum) return toast.warning("Please install metamask");

    // const accounts = await ethereum.request({ method: "eth_accounts" });

    // if (accounts.length) setStoreContext({ currentAccount: accounts[0] });
    // console.log(accounts);
    connectWallet();


    // } catch (error) {
    // toast.warning(`${error.response}`);
    // }
  };



  useEffect(() => {
    connectWallet();
    console.log(store)
    // eslint-disable-next-line
  }, []);

  return (
    <IndigoVotingContext.Provider
      value={{ store, setStoreContext }}
    >
      {children}
    </IndigoVotingContext.Provider>
  );
};

