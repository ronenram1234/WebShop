import { FunctionComponent } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { Stock } from "../interfaces/Stock";

interface StockDetailsTooltipProps {
  show: boolean;
  target: HTMLElement | null;
  onHide: () => void;
  stock: Stock | null;
}

const StockDetailsTooltip: FunctionComponent<StockDetailsTooltipProps> = ({
  show,
  target,
  onHide,
  stock,
}) => {
  return (
    <Overlay show={show} target={target} placement="right" onHide={onHide}>
      <Popover id="popover-basic" style={{ maxWidth: "400px" }}>
        <Popover.Header as="h3">Product Details</Popover.Header>
        <Popover.Body>
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
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};

export default StockDetailsTooltip;
