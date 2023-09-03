import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import ChainDonorMarketplaceArtifact from "../contracts/ChainDonorMarketplace.json";
import BloodTokenArtifact from "../contracts/BloodToken.json";
import contractAddress from "../resources/contract-address.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useSmartContracts = () => {
  const [smartContracts, setSmartContracts] = useState({
    chainDonorHub: null,
    chainDonorMarketplace: null,
    bloodToken: null,
  });

  useEffect(() => {
    const getSmartContracts = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainDonorHub = new ethers.Contract(
        contractAddress.ChainDonorHub,
        ChainDonorHubArtifact.abi,
        provider.getSigner()
      );
      const chainDonorMarketplace = new ethers.Contract(
        contractAddress.ChainDonorMarketplace,
        ChainDonorMarketplaceArtifact.abi,
        provider.getSigner()
      );
      const bloodToken = new ethers.Contract(
        contractAddress.BloodToken,
        BloodTokenArtifact.abi,
        provider.getSigner()
      );

      setSmartContracts({
        chainDonorHub,
        chainDonorMarketplace,
        bloodToken,
      });
    };
    getSmartContracts();
  }, []);

  return smartContracts;
};

export default useSmartContracts;
