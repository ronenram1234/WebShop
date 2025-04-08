import { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";
import { Stock } from "../interfaces/Stock";

interface StockDetailsModalProps {
  show: boolean;
  onHide: () => void;
  stock: Stock | null;
}

const StockDetailsModal: FunctionComponent<StockDetailsModalProps> = ({
  show,
  onHide,
  stock,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {stock && (
          <div>
            <p>
              <strong>Brand:</strong> {stock.Brand}
            </p>
            <p>
              <strong>Model:</strong> {stock.Model}
            </p>
            <p>
              <strong>SKU:</strong> {stock.SKU}
            </p>
            <p>
              <strong>Description:</strong> {stock.Description}
            </p>
            <p>
              <strong>Quantity:</strong> {stock.Quantity}
            </p>
            <p>
              <strong>Price (USD):</strong> {stock["Price (USD)"]}
            </p>
            <p>
              <strong>Condition:</strong> {stock.Condition}
            </p>
            <p>
              <strong>Detail:</strong> {stock.Detail}
            </p>
            <p>
              <strong>Product Category:</strong> {stock["Product Category"]}
            </p>
            <p>
              <strong>Part Number:</strong> {stock["Part Number"]}
            </p>
            <p>
              <strong>Serial Number:</strong> {stock["Serial Number"]}
            </p>
            <p>
              <strong>Location:</strong> {stock.Location}
            </p>
            <p>
              <strong>Status:</strong> {stock.Status}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default StockDetailsModal;
