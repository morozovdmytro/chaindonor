import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

const useIsOwner = (props) => {
  const { wallet } = props;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkIsOwner = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.ChainDonorHub,
        ChainDonorHubArtifact.abi,
        provider.getSigner()
      );
      const isOwner = wallet.toLowerCase() === (await contract.owner()).toLowerCase();
      setIsOwner(isOwner);
    };
    if (wallet?.length) {
        checkIsOwner();
    }
  }, [wallet]);

  return isOwner;
};

export default useIsOwner;
