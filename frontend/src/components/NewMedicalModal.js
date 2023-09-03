import React, { useState } from "react";
import { ethers } from "ethers";
import ChainDonorHubArtifact from "../contracts/ChainDonorHub.json";
import contractAddress from "../resources/contract-address.json";

export const NewMedicalModal = ({ show, onHide }) => {

  const [medicalInfo, setMedicalInfo] = useState({
    name: '',
    address: '',
    wallet: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalInfo({
      ...medicalInfo,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    //TODO: save donorInfo to database
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const donorHub = new ethers.Contract(
      contractAddress.ChainDonorHub,
      ChainDonorHubArtifact.abi,
      provider.getSigner()
    );
    const tx = await donorHub.addMedicalInstitution(medicalInfo.wallet);
    await tx.wait();
    handleClose();
  };

  const handleClose = () => {
    onHide();
  };

  return (
    <>
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: (show ? 'block' : 'none') }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register Medical Institution</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" name="name" value={medicalInfo.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" className="form-control" id="address" name="address" value={medicalInfo.address} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="wallet" className="form-label">Wallet</label>
                  <input type="text" className="form-control" id="wallet" name="wallet" value={medicalInfo.wallet} onChange={handleChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Register</button>
            </div>
          </div>
        </div>
      </div>

      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default NewMedicalModal;
