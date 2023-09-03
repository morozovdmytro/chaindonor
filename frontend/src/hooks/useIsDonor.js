import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

const useIsDonor = (props) => {
  const { wallet } = props;
  const [isDonor, setIsDonor] = useState(false);

  useEffect(() => {
    const checkIsDonor = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.ChainDonorHub,
        ChainDonorHubArtifact.abi,
        provider.getSigner()
      );
      const isDonor = await contract.isDonor(wallet);
      setIsDonor(isDonor);
    };
    if (wallet?.length) {
      checkIsDonor();
    }
  }, [wallet]);

  return isDonor;
};

export default useIsDonor;
