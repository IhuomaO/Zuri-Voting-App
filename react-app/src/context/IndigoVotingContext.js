import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

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
  return (
    <IndigoVotingContext.Provider value={{}}>
      {children}
    </IndigoVotingContext.Provider>
  );
};
