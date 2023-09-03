import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorMarketplaceArtifact from "../contracts/ChainDonorMarketplace.json";
import contractAddress from "../resources/contract-address.json";

const useIsCharity = (props) => {
  const { wallet } = props;
  const [isCharity, setIsCharity] = useState(false);

  useEffect(() => {
    const checkIsCharity = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.ChainDonorMarketplace,
        ChainDonorMarketplaceArtifact.abi,
        provider.getSigner()
      );
      const isCharity = await contract.isApprovedCharity(wallet);
      setIsCharity(isCharity);
    };
    if (wallet?.length) {
      checkIsCharity();
    }
  }, [wallet]);

  return isCharity;
};

export default useIsCharity;
