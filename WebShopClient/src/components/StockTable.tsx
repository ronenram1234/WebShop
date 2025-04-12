import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Stock } from "../interfaces/Stock";
import { BsHeart, BsHeartFill, BsCart, BsCartFill } from "react-icons/bs";
import StockDetailsModal from "./StockDetailsModal";
import StockDetailsTooltip from "./StockDetailsTooltip";
import { GlobalProps } from "../context/GlobalContext";
import {
  toggleStockFavorite,
  toggleStockCart,
  getUserCart,
  getUserFavorites,
} from "../services/stockServices";
import { errorMsg } from "../services/feedbackService";

interface StockTableProps {
  stocks: Stock[];
}

const StockTable: FunctionComponent<StockTableProps> = ({ stocks }) => {
  const { currentUser, token } = useContext(GlobalProps);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [tooltipTarget, setTooltipTarget] = useState<HTMLElement | null>(null);

  // Initialize favorites and cart items
  useEffect(() => {
    if (currentUser && token) {
      // Initialize favorites
      getUserFavorites(token)
        .then((response) => {
          const favoriteStocks = response.data;
          const userFavorites = new Set<string>();
          favoriteStocks.forEach((stock: Stock) => {
            userFavorites.add(stock._id || "");
          });
          setFavorites(userFavorites);
        })
        .catch((error) => {
          console.error("Error fetching favorite items:", error);
        });

      // Initialize cart items
      getUserCart(token)
        .then((response) => {
          const cartStocks = response.data;
          const userCart = new Set<string>();
          cartStocks.forEach((stock: Stock) => {
            userCart.add(stock._id || "");
          });
          setCartItems(userCart);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    } else {
      // Reset favorites and cart when user logs out
      setFavorites(new Set());
      setCartItems(new Set());
    }
  }, [currentUser, token]);

  const handleFavoriteToggle = async (stock: Stock) => {
    if (!token) {
      errorMsg("Please log in to add items to favorites");
      return;
    }

    const stockId = stock._id;
    if (!stockId) {
      errorMsg("Invalid stock ID. Please refresh the page and try again.");
      return;
    }

    try {
      const response = await toggleStockFavorite(stockId, token);
      const updatedStock = response.data;

      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (updatedStock.isFavorite) {
          newFavorites.add(stockId);
        } else {
          newFavorites.delete(stockId);
        }
        return newFavorites;
      });
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      if (error.response?.status === 401) {
        errorMsg("Please log in to add items to favorites");
      } else if (error.response?.status === 404) {
        errorMsg(
          "Stock not found. The stock may have been removed. Please refresh the page."
        );
      } else {
        errorMsg("Failed to update favorite status. Please try again.");
      }
    }
  };

  const handleCartToggle = async (stockId: string) => {
    if (!currentUser) {
      return;
    }

    try {
      const response = await toggleStockCart(stockId, token);
      const updatedStock = response.data;

      setCartItems((prev) => {
        const newCartItems = new Set(prev);
        if (updatedStock.inCart) {
          newCartItems.add(stockId);
        } else {
          newCartItems.delete(stockId);
        }
        return newCartItems;
      });
    } catch (error) {
      console.error("Error toggling cart:", error);
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

  return (
    <div className="container mt-4">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Brand</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Model</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>SKU</th>
            <th style={{ width: "40%" }}>Description</th>
            <th style={{ width: "7.5%" }}>Favorite</th>
            <th style={{ width: "7.5%" }}>Cart</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const stockId = stock._id || "";
            const isFavorite = favorites.has(stockId);
            const isInCart = cartItems.has(stockId);

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
                      color: isInCart ? "#28a745" : "#198754",
                      opacity: currentUser ? 1 : 0.5,
                      cursor: currentUser ? "pointer" : "not-allowed",
                    }}
                    title={
                      currentUser
                        ? isInCart
                          ? "Remove from cart"
                          : "Add to cart"
                        : "Please log in to add to cart"
                    }
                  >
                    {isInCart ? <BsCartFill size={20} /> : <BsCart size={20} />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <StockDetailsTooltip
        show={showTooltip}
        target={tooltipTarget}
        onHide={() => setShowTooltip(false)}
        stock={selectedStock}
      />

      <StockDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        stock={selectedStock}
      />
    </div>
  );
};

export default StockTable;
