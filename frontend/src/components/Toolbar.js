import React, { useState } from "react";
import useIsDonor from "../hooks/useIsDonor";
import { NewCharityModal } from "./NewCharityModal";
import { NewMedicalModal } from "./NewMedicalModal";
import { NewDonorModal } from "./NewDonorModal";
import useIsOwner from "../hooks/useIsOwner";

export const Toolbar = (selectedWallet) => {
  const [state, setState] = useState({
    showDonorModal: false,
    showMedicalModal: false,
    showCharityModal: false,
  });

  const isDonor = useIsDonor(selectedWallet);
  const isOwner = useIsOwner(selectedWallet);

  const handleShowDonorModal = () => {
    this.setState({ showDonorModal: true });
  };

  const handleDonorModalClose = () => {
    setState({ ...state, showDonorModal: false });
  };

  const handleShowMedicalModal = () => {
    setState({ ...state, showMedicalModal: true });
  };

  const handleMedicalModalClose = () => {
    setState({ ...state, showMedicalModal: false });
  };

  const handleShowCharityModal = () => {
    setState({ ...state, showCharityModal: true });
  };

  const handleCharityModalClose = () => {
    setState({ showCharityModal: false });
  };
  return (
    <>
      <div className="row">
        {!isDonor && (
          <div className="col-4">
            <button className="btn btn-primary" onClick={handleShowDonorModal}>
              Register Donor
            </button>
          </div>
        )}
        {isOwner && (
          <>
            <div className="col-4">
              <button
                className="btn btn-primary"
                onClick={handleShowMedicalModal}
              >
                Register Medical
              </button>
            </div>
            <div className="col-4">
              <button
                className="btn btn-primary"
                onClick={handleShowCharityModal}
              >
                Register Charity
              </button>
            </div>
          </>
        )}
      </div>
      <NewDonorModal
        show={state.showDonorModal}
        onHide={handleDonorModalClose}
      />
      <NewMedicalModal
        show={state.showMedicalModal}
        onHide={handleMedicalModalClose}
      />
      <NewCharityModal
        show={state.showCharityModal}
        onHide={handleCharityModalClose}
      />
    </>
  );
};
