import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

export const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.ChainDonorHub,
    ChainDonorHubArtifact.abi,
    provider.getSigner()
  );

  useEffect(() => {
    async function fetchDonations() {
      try {
        const count = await contract.totalDonations();
        const data = [];
        for (let i = 0; i < count; i++) {
          const donor = await contract.donations(i);
          data.push(donor);
        }
        setDonations(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    fetchDonations();
  }, []);

  const handleDonationApprove = async (index) => {
    setError(null);
    try {
      const tx = await contract.approveDonation(index);
      await tx.wait();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
    }
  };

  const handleClaim = async (index) => {
    setError(null);
    try {
      const tx = await contract.claimReward(index);
      await tx.wait();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
    }
  }

  if (donations.length === 0) return <></>;

  return (
    <div>
      <h2>Donations</h2>
      <div className="row">
        <div className="col">
          {error?.length && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      <table className="table">
        <tbody>
          {donations.map((donation, index) => (
            <tr key={index}>
              <td>{donation.donor}</td>
              <td>{donation.amount?.toString()}</td>
              <td>
                {!donation.isApproved && (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleDonationApprove(index)}
                  >
                    Approve
                  </button>
                )}
                {
                    donation.isApproved && !donation.claimed && (
                        <button
                            className="btn btn-success"
                            onClick={() => handleClaim(index)}
                        >
                            Claim
                        </button>
                    )
                }
                {
                    donation.claimed && (<span className="badge badge-success">Claimed</span>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donations;
