import React, { useState, useEffect } from "react";
import { NewItemModal } from "./NewItemModal";
import useIsCharity from "../hooks/useIsCharity";
import useSmartContracts from "../hooks/useSmartContracts";

export const Charities = (selectedWallet) => {
  const [charities, setCharities] = useState([]);
  const [charityCandidates, setCharityCandidates] = useState([]);
  const [approveError, setApproveError] = useState(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const { chainDonorMarketplace } = useSmartContracts();

  useEffect(() => {
    async function fetchCharities() {
      try {
        const count = await chainDonorMarketplace.totalCharities();
        const data = [];
        for (let i = 0; i < count; i++) {
          const charity = await chainDonorMarketplace.charities(i);
          data.push(charity);
        }
        setCharities(data.filter((ch) => ch.isApproved));
        setCharityCandidates(data.filter((ch) => !ch.isApproved));
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    if(chainDonorMarketplace){
      fetchCharities();
    }
  }, [chainDonorMarketplace]);

  const handleNewItemHide = () => {
    setShowNewItemModal(false);
  };

  const handleNewItemShow = () => {
    setShowNewItemModal(true);
  };

  const handleApprove = async (wallet) => {
    setApproveError(null);
    try {
      const tx = await chainDonorMarketplace.approveAddCharity(wallet);
      await tx.wait();
      setCharityCandidates(
        charityCandidates.filter((ch) => ch.wallet !== wallet)
      );
      setCharities([...charities, { wallet }]);
    } catch (error) {
      setApproveError(error.error?.data?.message || "Unhandled error");
    }
  };

  const isCharity = useIsCharity(selectedWallet);

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
          {isCharity && (
            <div className="row mb-5">
              <div className="col-12">
                <button className="btn btn-primary" onClick={handleNewItemShow}>
                  Add item
                </button>
              </div>
            </div>
          )}
          <NewItemModal show={showNewItemModal} onHide={handleNewItemHide} />
        </>
      )}
    </div>
  );
};

export default Charities;
