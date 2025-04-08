import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { GlobalProps } from "../context/GlobalContext";
import { Stock } from "../interfaces/Stock";
import {
  getUserFavorites,
  toggleStockFavorite,
  toggleStockCart,
  getUserCart,
} from "../services/stockServices";
import { BsHeart, BsHeartFill, BsCart, BsCartFill } from "react-icons/bs";

// interface FavCardsProps {}

const FavCards: FunctionComponent = () => {
  const { currentUser, token } = useContext(GlobalProps);
  const [favoriteStocks, setFavoriteStocks] = useState<Stock[]>([]);
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && token) {
        try {
          const [favResponse, cartResponse] = await Promise.all([
            getUserFavorites(token),
            getUserCart(token),
          ]);
          setFavoriteStocks(favResponse.data);

          const userCart = new Set<string>();
          cartResponse.data.forEach((stock: Stock) => {
            userCart.add(stock._id || "");
          });
          setCartItems(userCart);

          setError(null);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load favorite products");
          setFavoriteStocks([]);
          setCartItems(new Set());
        }
      } else {
        setFavoriteStocks([]);
        setCartItems(new Set());
      }
    };

    fetchData();
  }, [currentUser, token]);

  const handleFavoriteToggle = async (stock: Stock) => {
    if (!currentUser || !token) return;

    try {
      await toggleStockFavorite(stock._id || "", token);
      setFavoriteStocks((prev) => prev.filter((s) => s._id !== stock._id));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleCartToggle = async (stockId: string) => {
    if (!currentUser || !token) return;

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
          Please log in to view your favorite products
        </div>
      </Container>
    );
  }

  if (favoriteStocks.length === 0) {
    return (
      <Container className="mt-4">
        <div className="alert alert-info">
          You haven't added any products to your favorites yet
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Favorite Products</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {favoriteStocks.map((stock) => (
          <Col key={stock._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{stock.Brand}</Card.Title>
                <Card.Text>
                  <div style={{ marginBottom: "8px" }}>
                    <div className="d-flex mb-1">
                      <div>
                        <strong>Model: </strong>
                      </div>
                      <div>{stock.Model}</div>
                    </div>
                    <div className="d-flex mb-1">
                      <div>
                        <strong>SKU: </strong>
                      </div>
                      <div>{stock.SKU}</div>
                    </div>
                    <div className="d-flex mb-1">
                      <div>
                        <strong>Price: </strong>
                      </div>
                      <div>${stock["Price (USD)"]}</div>
                    </div>
                    <div className="d-flex">
                      <div>
                        <strong>Condition: </strong>
                      </div>
                      <div>{stock.Condition}</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: "0" }}>
                    <strong>Description: </strong>
                    <div>{stock.Description}</div>
                  </div>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-link"
                    onClick={() => handleFavoriteToggle(stock)}
                    style={{
                      color: "#ff4d4d",
                      cursor: "pointer",
                    }}
                    title="Remove from favorites"
                  >
                    <BsHeartFill size={20} />
                  </button>
                  <button
                    className="btn btn-link"
                    onClick={() => handleCartToggle(stock._id || "")}
                    style={{
                      color: cartItems.has(stock._id || "")
                        ? "#198754"
                        : "#0d6efd",
                      cursor: "pointer",
                    }}
                    title={
                      cartItems.has(stock._id || "")
                        ? "Remove from cart"
                        : "Add to cart"
                    }
                  >
                    {cartItems.has(stock._id || "") ? (
                      <BsCartFill size={20} />
                    ) : (
                      <BsCart size={20} />
                    )}
                  </button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FavCards;
