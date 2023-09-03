import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

export const Medicals = () => {
  const [medicals, setMedicals] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.ChainDonorHub,
    ChainDonorHubArtifact.abi,
    provider
  );

  useEffect(() => {
    async function fetchMedicals() {
      try {
        const count = await contract.totalInstitutions();
        const data = [];
        for (let i = 0; i < count; i++) {
          const medical = await contract.medicalInstitutions(i);
          data.push(medical);
        }
        setMedicals(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    fetchMedicals();
  }, []);

  if(medicals.length === 0) return (<></>);

  return (
    <div>
      <h2>Medical Institutions</h2>
      <table className="table">
        <tbody>
          {medicals.map((med, index) => (
            <tr key={index}>
              <td>{med.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medicals;
