import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { Stock } from "../interfaces/Stock";
import {
  BsHeart,
  BsHeartFill,
  BsCart,
  BsCartFill,
  BsCheckCircle,
  BsCheckCircleFill,
} from "react-icons/bs";
import StockDetailsModal from "./StockDetailsModal";
import StockDetailsTooltip from "./StockDetailsTooltip";
import { GlobalProps } from "../context/GlobalContext";
import {
  toggleStockFavorite,
  toggleStockCart,
  getUserCart,
  getUserFavorites,
  requestQuota,
} from "../services/stockServices";
import { errorMsg, successMsg } from "../services/feedbackService";

const CartTable: FunctionComponent = () => {
  const { currentUser, token } = useContext(GlobalProps);
  const [cartStocks, setCartStocks] = useState<Stock[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [tooltipTarget, setTooltipTarget] = useState<HTMLElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotaAmount, setQuotaAmount] = useState<number>(1);
  const [selectedStockForQuota, setSelectedStockForQuota] =
    useState<Stock | null>(null);

  // Initialize cart items and favorites
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && token) {
        try {
          const [cartResponse, favoritesResponse] = await Promise.all([
            getUserCart(token),
            getUserFavorites(token),
          ]);

          setCartStocks(cartResponse.data);

          const userFavorites = new Set<string>();
          favoritesResponse.data.forEach((stock: Stock) => {
            userFavorites.add(stock._id || "");
          });
          setFavorites(userFavorites);
          setError(null);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load cart items");
          setCartStocks([]);
          setFavorites(new Set());
        }
      } else {
        setCartStocks([]);
        setFavorites(new Set());
      }
    };

    fetchData();
  }, [currentUser, token]);

  const handleFavoriteToggle = async (stock: Stock) => {
    if (!currentUser) return;

    try {
      const response = await toggleStockFavorite(stock._id || "", token);
      const updatedStock = response.data;

      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (updatedStock.isFavorite) {
          newFavorites.add(stock._id || "");
        } else {
          newFavorites.delete(stock._id || "");
        }
        return newFavorites;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCartToggle = async (stockId: string) => {
    if (!currentUser) return;

    try {
      await toggleStockCart(stockId, token);
      // Remove the item from the cart table
      setCartStocks((prev) => prev.filter((stock) => stock._id !== stockId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleShowDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setSelectedStockId(stock._id || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    stock: Stock
  ) => {
    setTooltipTarget(event.currentTarget);
    setSelectedStock(stock);
    setSelectedStockId(stock._id || "");
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleQuotaRequest = async () => {
    if (!selectedStockForQuota || !token) return;

    try {
      await requestQuota(selectedStockForQuota._id || "", quotaAmount, token);
      // Update the local state to reflect the change
      setCartStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock._id === selectedStockForQuota._id
            ? {
                ...stock,
                requestedQuota: quotaAmount,
                quotaRequestDate: new Date().toISOString(),
                quotaHandled: false,
              }
            : stock
        )
      );
      setShowQuotaModal(false);
      setQuotaAmount(0);
      setSelectedStockForQuota(null);
    } catch (error) {
      console.error("Error requesting quota:", error);
    }
  };

  const openQuotaModal = (stock: Stock) => {
    setSelectedStockForQuota(stock);
    setQuotaAmount(1);
    setShowQuotaModal(true);
  };

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container className="mt-4">
        <div className="alert alert-info">
          Please log in to view your cart items
        </div>
      </Container>
    );
  }

  if (cartStocks.length === 0) {
    return (
      <Container className="mt-4">
        <div className="alert alert-info">Your cart is empty</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Brand</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Model</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>SKU</th>
            <th style={{ width: "30%" }}>Description</th>
            <th style={{ width: "7.5%" }}>Favorite</th>
            <th style={{ width: "7.5%" }}>Cart</th>
            <th style={{ width: "15%" }}>Status</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartStocks.map((stock) => {
            const stockId = stock._id || "";
            const isFavorite = favorites.has(stockId);

            return (
              <tr
                key={stockId}
                className={
                  (showModal && selectedStockId === stockId) ||
                  (showTooltip && selectedStockId === stockId)
                    ? "table-primary"
                    : ""
                }
                style={{
                  transition: "background-color 0.3s ease",
                }}
              >
                <td
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {stock.Brand}
                </td>
                <td
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {stock.Model}
                </td>
                <td
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    color: "#0d6efd",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleShowDetails(stock)}
                  onMouseEnter={(e) => handleMouseEnter(e, stock)}
                  onMouseLeave={handleMouseLeave}
                  title="Click for details"
                >
                  {stock.SKU}
                </td>
                <td style={{ wordWrap: "break-word", minWidth: "160px" }}>
                  {stock.Description}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-link"
                    onClick={() => handleFavoriteToggle(stock)}
                    style={{
                      color: isFavorite ? "#ff4d4d" : "#dc3545",
                      opacity: currentUser ? 1 : 0.5,
                      cursor: currentUser ? "pointer" : "not-allowed",
                    }}
                    title={
                      currentUser
                        ? isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                        : "Please log in to add to favorites"
                    }
                  >
                    {isFavorite ? (
                      <BsHeartFill size={20} />
                    ) : (
                      <BsHeart size={20} />
                    )}
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-link"
                    onClick={() => handleCartToggle(stockId)}
                    style={{
                      color: "#198754",
                      cursor: "pointer",
                    }}
                    title="Remove from cart"
                  >
                    <BsCartFill size={20} />
                  </button>
                </td>
                <td className="text-center">
                  {stock.requestedQuota ? (
                    stock.quotaHandled ? (
                      <span className="text-success">Handled</span>
                    ) : (
                      <span className="text-warning">Pending</span>
                    )
                  ) : (
                    <span className="text-secondary">No Request</span>
                  )}
                </td>
                <td className="text-center">
                  <Button
                    variant={
                      stock.requestedQuota
                        ? "outline-secondary"
                        : "outline-primary"
                    }
                    size="sm"
                    onClick={() => openQuotaModal(stock)}
                    disabled={
                      !currentUser || stock.requestedQuota !== undefined
                    }
                    title={
                      stock.requestedQuota
                        ? "Quota already requested"
                        : "Request Quota"
                    }
                  >
                    {stock.requestedQuota ? "Requested" : "Request Quota"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Quota Request Modal */}
      <Modal show={showQuotaModal} onHide={() => setShowQuotaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Quota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quotaAmount}
                onChange={(e) => setQuotaAmount(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuotaModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleQuotaRequest}>
            Submit Request
          </Button>
        </Modal.Footer>
      </Modal>

      <StockDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        stock={selectedStock}
      />

      <StockDetailsTooltip
        show={showTooltip}
        target={tooltipTarget}
        onHide={handleMouseLeave}
        stock={selectedStock}
      />
    </Container>
  );
};

export default CartTable;
