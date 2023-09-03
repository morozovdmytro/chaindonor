import React, { useState, useEffect } from "react";
import useIsMedicalInstitution from "../hooks/useIsMedicalInstitution";
import useSmartContracts from "../hooks/useSmartContracts";
import { iterateOverData } from "../helpers/utils";

export const Donations = (selectedWallet) => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const { chainDonorHub } = useSmartContracts();

  useEffect(() => {
    async function fetchDonations() {
      try {
        const data = await iterateOverData(chainDonorHub.totalDonations, chainDonorHub.donations);
        setDonations(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    if(chainDonorHub){
      fetchDonations();
    }
  }, [chainDonorHub]);

  const isMedical = useIsMedicalInstitution(selectedWallet);

  const handleDonationApprove = async (index) => {
    setError(null);
    try {
      const tx = await chainDonorHub.approveDonation(index);
      await tx.wait();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
    }
  };

  const handleClaim = async (index) => {
    setError(null);
    try {
      const tx = await chainDonorHub.claimReward(index);
      await tx.wait();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
    }
  }
  
  const isDonator = (wallet) => {
    return wallet.toLowerCase() === selectedWallet.toLowerCase();
  };

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
                    disabled={!isDonator(donation.donor)}
                    className="btn btn-warning"
                    onClick={() => handleDonationApprove(index)}
                  >
                    Approve
                  </button>
                )}
                {
                    donation.isApproved && !donation.claimed && (
                        <button
                            disabled={!isMedical}
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
