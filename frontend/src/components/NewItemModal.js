import React, { useState } from "react";
import useSmartContracts from "../hooks/useSmartContracts";

export const NewItemModal = ({ show, onHide }) => {
  const [error, setError] = useState(null);
  const [itemInfo, setItemInfo] = useState({
    name: "",
    price: 0
  });

  const { chainDonorMarketplace } = useSmartContracts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemInfo({
      ...itemInfo,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      //TODO: save medical institution to database
      const tx = await chainDonorMarketplace.addItem(itemInfo.name, itemInfo.price);
      await tx.wait();
      handleClose();
    } catch (error) {
      setError(error.error?.data?.message || error || "Unhandled error");
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
              <h5 className="modal-title">New item</h5>
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
                    Item name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={itemInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={itemInfo.price}
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

export default NewItemModal;
