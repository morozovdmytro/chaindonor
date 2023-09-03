import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChainDonorMarketplaceArtifact from "../contracts/ChainDonorMarketplace.json";
import contractAddress from "../resources/contract-address.json";

export const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [charityCandidates, setCharityCandidates] = useState([]);
  const [approveError, setApproveError] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.ChainDonorMarketplace,
    ChainDonorMarketplaceArtifact.abi,
    provider.getSigner()
  );

  useEffect(() => {
    async function fetchCharities() {
      try {
        const count = await contract.totalCharities();
        const data = [];
        for (let i = 0; i < count; i++) {
          const charity = await contract.charities(i);
          data.push(charity);
        }
        setCharities(data.filter((ch) => ch.isApproved));
        setCharityCandidates(
          data.filter(
            (ch) => !ch.isApproved
          )
        );
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    fetchCharities();
  }, []);

  const handleApprove = async (wallet) => {
    setApproveError(null);
    try {
      const tx = await contract.approveAddCharity(wallet);
      await tx.wait();
      setCharityCandidates(
        charityCandidates.filter((ch) => ch.wallet !== wallet)
      );
      setCharities([...charities, { wallet }]);
    } catch (error) {
      setApproveError(error.error?.data?.message || "Unhandled error");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          {approveError?.length && (
            <div className="alert alert-danger" role="alert">
              {approveError}
            </div>
          )}
        </div>
      </div>
      {charityCandidates?.length > 0 && (
        <>
          <h2>Charity Candidates</h2>
          <table className="table">
            <tbody>
              {charityCandidates.map((ch, index) => (
                <tr key={index}>
                  <td>{ch.wallet}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleApprove(ch.wallet)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
        </>
      )}
      {charities?.length > 0 && (
        <>
          <h2>Charities</h2>
          <table className="table">
            <tbody>
              {charities.map((ch, index) => (
                <tr key={index}>
                  <td>{ch.wallet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Charities;
