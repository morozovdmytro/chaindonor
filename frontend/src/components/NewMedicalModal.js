import React, { useState } from "react";
import useSmartContracts from "../hooks/useSmartContracts";

export const NewMedicalModal = ({ show, onHide }) => {
  const [error, setError] = useState(null);
  const [medicalInfo, setMedicalInfo] = useState({
    name: "",
    address: "",
    wallet: "",
  });
  const { chainDonorHub } = useSmartContracts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalInfo({
      ...medicalInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      //TODO: save medical institution to database
      const tx = await chainDonorHub.addMedicalInstitution(medicalInfo.wallet);
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
              <h5 className="modal-title">Register Medical Institution</h5>
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
                    value={medicalInfo.name}
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
                    value={medicalInfo.address}
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
                    value={medicalInfo.wallet}
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

export default NewMedicalModal;
