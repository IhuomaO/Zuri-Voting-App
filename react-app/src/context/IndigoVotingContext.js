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
    contractDetails: { isLoading: true },

  })
  const setStoreContext = (state) => setStore({ ...store, ...state })

  const history = useHistory();


  const connectWallet = async () => {
    try {
      console.log('trying to connect');
      if (!ethereum) return toast.warning("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      localStorage.setItem("account", accounts[0]);
      // console.log(localStorage.getItem("account"));
      history.push("/auth/dashboard");
      setStoreContext({ currentAccount: accounts[0] });



    } catch (error) {
      console.log(`${error.response}`);
    }
  };


  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return toast.warning("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) setStoreContext({ currentAccount: accounts[0] });


      const account = accounts[0]

      const { contract } = store
      setStoreContext({
        ...store,
        currentAccount: account,
        connectWallet,
        contractDetails: {
          electionDetails: await contract.electionDetails(),
          owner: await contract.owner(),
          totalVoters: await contract.getTotalVoter(),
          chairman: await contract.chairman(),
          isTeacher: await contract.isTeacher(account),
          isStudent: await contract.isStudent(account),
          isBODMember: await contract.isBODMember(account),
          isStakeHolder: await contract.isStakeHolder(account),
          isLoading: false
          // bod: await contract.BOD(account),
          // candidateDetails: await contract.candidateDetails(),
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

  return (
    <IndigoVotingContext.Provider
      value={{ store, setStoreContext }}
    >
      {children}
    </IndigoVotingContext.Provider>
  );
};

