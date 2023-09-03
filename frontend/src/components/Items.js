import React, { useState, useEffect } from "react";
import useSmartContracts from "../hooks/useSmartContracts";

export const Items = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const { chainDonorMarketplace, bloodToken } = useSmartContracts();

  useEffect(() => {
    async function fetchItems() {
      try {
        const count = await chainDonorMarketplace.totalItems();
        const data = [];
        for (let i = 0; i < count; i++) {
          const item = await chainDonorMarketplace.items(i);
          data.push(item);
        }
        setItems(data);
      } catch (error) {
        console.error("An error occurred while fetching data: ", error);
      }
    }
    if(chainDonorMarketplace){
      fetchItems();
    }
  }, [chainDonorMarketplace]);

  const handlePurchase = async (index) => {
    setError(null);
    try {
      const allowanceTx = await bloodToken.approve(chainDonorMarketplace.address, items[index].price);
      await allowanceTx.wait();
      const tx = await chainDonorMarketplace.purchaseItem(index);
      await tx.wait();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
    }
  }

  if (items.length === 0) return <></>;

  return (
    <div>
      <h2>Marketplace</h2>
      <div className="row">
        <div className="col">
          {error?.length && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      <table className="table">
        <tbody>
          {items.map((donation, index) => (
            <tr key={index}>
              <td>{donation.name}</td>
              <td>{donation.price?.toString()}</td>
              <td>
                {!donation.purchased && (
                  <button
                    className="btn btn-success"
                    onClick={() => handlePurchase(index)}
                  >
                    Purchase
                  </button>
                )}
                {
                    donation.purchased && (<span className="badge badge-success">Purchased</span>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;
