import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

export const Donors = () => {
  const [donors, setDonors] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.ChainDonorHub,
    ChainDonorHubArtifact.abi,
    provider
  );

  useEffect(() => {
    async function fetchDonors() {
      try {
        const count = await contract.getDonorCount();
        const data = [];
        for (let i = 0; i < count; i++) {
          const donor = await contract.donors(i);
          data.push(donor);
        }
        setDonors(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    fetchDonors();
  }, []);

  if(donors.length === 0) return (<></>);

  return (
    <div>
      <h2>Donors</h2>
      <table className="table">
        <tbody>
          {donors.map((donor, index) => (
            <tr key={index}>
              <td>{donor.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donors;
