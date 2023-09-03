import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

const useIsMedicalInstitution = (props) => {
  const { wallet } = props;
  const [isMedicalInstitution, setIsMedicalInstitution] = useState(false);

  useEffect(() => {
    const checkIsMedicalInstitution = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.ChainDonorHub,
        ChainDonorHubArtifact.abi,
        provider.getSigner()
      );
      const isMedicalInstitution = await contract.isMedicalInstitution(wallet);
      setIsMedicalInstitution(isMedicalInstitution);
    };
    if (wallet?.length) {
      checkIsMedicalInstitution();
    }
  }, [wallet]);

  return isMedicalInstitution;
};

export default useIsMedicalInstitution;
