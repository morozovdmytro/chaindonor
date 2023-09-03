import React, { useState } from "react";
import { ethers } from "ethers";
import sha256 from "crypto-js/sha256";
import useSmartContracts from "../hooks/useSmartContracts";

export const NewDonorModal = ({ show, onHide }) => {
  const [error, setError] = useState(null);

  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    bloodType: "",
  });

  const { chainDonorHub } = useSmartContracts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    //TODO: save donorInfo to database
    setError(null);
    try {
      const donorInfoHash = ethers.utils.arrayify(
        "0x" + hashDonorInfo(donorInfo)
      );
      const tx = await chainDonorHub.registerDonor(donorInfoHash);
      await tx.wait();
      handleClose();
    } catch (error) {
      setError(error.error?.data?.message || 'Unhandled error');
    }
  };

  const handleClose = () => {
    onHide();
  };

  const hashDonorInfo = (donorInfo) => {
    const hash = sha256(JSON.stringify(donorInfo));
    return hash.toString();
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
              <h5 className="modal-title">Register Donor</h5>
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
                    value={donorInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={donorInfo.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bloodType" className="form-label">
                    Blood Type
                  </label>
                  <select
                    className="custom-select"
                    id="bloodType"
                    name="bloodType"
                    value={donorInfo.bloodType}
                    onChange={handleChange}
                  >
                    <option>Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
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

export default NewDonorModal;
