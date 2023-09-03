import React, { useState, useEffect } from "react";
import { NewDonationModal } from "./NewDonationModal";
import useIsMedicalInstitution from "../hooks/useIsMedicalInstitution";
import useSmartContracts from "../hooks/useSmartContracts";

export const Medicals = (selectedWallet) => {
  const [medicals, setMedicals] = useState([]);
  const [showNewDonationModal, setShowNewDonationModal] = useState(false);
  const { chainDonorHub } = useSmartContracts();

  useEffect(() => {
    async function fetchMedicals() {
      try {
        const count = await chainDonorHub.totalInstitutions();
        const data = [];
        for (let i = 0; i < count; i++) {
          const medical = await chainDonorHub.medicalInstitutions(i);
          data.push(medical);
        }
        setMedicals(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    if(chainDonorHub){
      fetchMedicals();
    }
  }, [chainDonorHub]);

  const handleNewDonationHide = () => {
    setShowNewDonationModal(false);
  };

  const handleNewDonationShow = () => {
    setShowNewDonationModal(true);
  };

  const isMedical = useIsMedicalInstitution(selectedWallet);

  if (medicals.length === 0) return <></>;

  return (
    <div>
      <h2>Medical Institutions</h2>
      <table className="table">
        <tbody>
          {medicals.map((med, index) => (
            <tr key={index}>
              <td>{med.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isMedical && (
        <div className="row mb-5">
          <div className="col-12">
            <button className="btn btn-primary" onClick={handleNewDonationShow}>
              Add donation
            </button>
          </div>
        </div>
      )}
      <NewDonationModal
        show={showNewDonationModal}
        onHide={handleNewDonationHide}
      />
    </div>
  );
};

export default Medicals;
