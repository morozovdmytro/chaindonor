import React, { useState } from "react";
import useSmartContracts from "../hooks/useSmartContracts";

export const NewDonationModal = ({ show, onHide }) => {
  const [error, setError] = useState(null);
  const [donationInfo, setDonationInfo] = useState({
    donorWallet: "",
    amount: 0
  });

  const { chainDonorHub } = useSmartContracts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationInfo({
      ...donationInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      //TODO: save medical institution to database
      const tx = await chainDonorHub.createDonation(donationInfo.donorWallet, donationInfo.amount);
      await tx.wait();
      handleClose();
    } catch (error) {
      setError(error.error?.data?.message || "Unhandled error");
    }
  };

  const handleClose = () => {
    onHide();
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show" : ""}`}
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New donation</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  {error?.length && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                </div>
              </div>
              <form>
                <div className="mb-3">
                  <label htmlFor="donorWallet" className="form-label">
                    Donor Wallet
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="donorWallet"
                    name="donorWallet"
                    value={donationInfo.donorWallet}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Blood amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    value={donationInfo.amount}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default NewDonationModal;
