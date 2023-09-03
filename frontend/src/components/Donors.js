import React, { useState, useEffect } from "react";
import useSmartContracts from "../hooks/useSmartContracts";
import { iterateOverData } from "../helpers/utils";

export const Donors = () => {
  const [donors, setDonors] = useState([]);
  const { chainDonorHub } = useSmartContracts();

  useEffect(() => {
    async function fetchDonors() {
      try {
        const data = await iterateOverData(chainDonorHub.totalDonors, chainDonorHub.donors);
        setDonors(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    if (chainDonorHub) {
      fetchDonors();
    }
  }, [chainDonorHub]);

  if (donors.length === 0) return <></>;

  return (
    <div>
      <h2>Donors</h2>
      <table className="table">
        <tbody>
          {donors.map((donor, index) => (
            <tr key={index}>
              <td>{donor.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donors;
