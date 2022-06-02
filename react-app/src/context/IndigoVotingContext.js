import React, { useEffect, useState, createContext, useContext } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { contractABI, contractAddress } from "../utils/constants";

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


const connectWallet = async (history) => {
  try {
    if (!ethereum) return toast.warning("Please install metamask");
    console.log('trying to connect');
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    localStorage.setItem("account", accounts[0]);
    // console.log(localStorage.getItem("account"));
    history.push("/auth/dashboard");
    document.location.reload()
    // setStoreContext({ currentAccount: accounts[0] });



  } catch (error) {
    console.log(`${error.response}`);
  }
};

export const IndigoVotingProvider = ({ children }) => {
  const [store, setStore] = useState({
    currentAccount: null,
    contract: getEthereumContract(),
    connectWallet,
    contractDetails: { isLoading: true },
    voted: false,
  })
  const setStoreContext = (state) => setStore({ ...store, ...state })

  // const history = useHistory();




  const checkIfWalletIsConnected = async () => {
    // try {
    if (!ethereum) return toast.warning("Please install metamask");

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length) setStoreContext({ currentAccount: accounts[0] })
    else return


    const account = accounts[0]
    const { contract } = store
    console.log(account);

    const contractDetails = {
      owner: await contract.owner(),
      electionCount: await contract.electionCount(),
      chairman: await contract.chairman(),
      isTeacher: await contract.isTeacher(account),
      isStudent: await contract.isStudent(account),
      isBODMember: await contract.isBODMember(account),
      isStakeHolder: await contract.isStakeHolder(account),
      winnerOfElection: async (id) => await contract.ViewWinnerOfElection(id),
      // bod: await contract.BOD(account),
      // candidateDetails: await contract.candidateDetails(),
      isLoading: false
    }
    contractDetails.owner = contractDetails.owner.toLowerCase()
    contractDetails.isOwner = account === contractDetails.owner
    contractDetails.isChairman = account === contractDetails.chairman.toLowerCase()

    contractDetails.electionDetails = []

    contractDetails.electionCount = Number(contractDetails.electionCount)

    for (let i = 1; i <= contractDetails.electionCount; i++) {
      let election = await contract.elections(i)
      // election.map((item, i) => {
      //   if (i === 2 || i === 3) {
      //     return Number(item)
      //   } else return item
      // })
      contractDetails.electionDetails.push(election)
    }

    setStoreContext({
      ...store,
      currentAccount: account,
      contractDetails,
    })
    // } else {
    //   setStoreContext({
    //     showNothing: true,
    //     isLoading: false,
    //   })
    // }
    // } catch (error) {
    //   toast.warning(`${error.response}`);
    // }
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

