import React, { useState } from "react";
import useSmartContracts from "../hooks/useSmartContracts";

export const NewCharityModal = ({ show, onHide }) => {
  const [error, setError] = useState(null);
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    address: "",
    wallet: "",
  });

  const { chainDonorMarketplace } = useSmartContracts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharityInfo({
      ...charityInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      //TODO: save medical institution to database
      const tx = await chainDonorMarketplace.addCharity(charityInfo.wallet);
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
              <h5 className="modal-title">Register Charity</h5>
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
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={charityInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={charityInfo.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="wallet" className="form-label">
                    Wallet
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="wallet"
                    name="wallet"
                    value={charityInfo.wallet}
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

export default NewCharityModal;
