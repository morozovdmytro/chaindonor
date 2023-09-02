import React, { useState } from "react";

export const NewDonorModal = ({ show, onHide }) => {

  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    bloodType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: value
    });
  };

  const handleSubmit = () => {
    console.log("Donor Information Submitted", donorInfo);
    // Do something with donorInfo, like sending it to a server or smart contract
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
              <h5 className="modal-title">Register Donor</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" name="name" value={donorInfo.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" value={donorInfo.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="bloodType" className="form-label">Blood Type</label>
                  <select className="custom-select" id="bloodType" name="bloodType" value={donorInfo.bloodType} onChange={handleChange}>
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

export default NewDonorModal;
