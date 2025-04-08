import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  ReactElement,
} from "react";
import { GlobalProps } from "../context/GlobalContext";
import { Stock } from "../interfaces/Stock";
import { errorMsg, successMsg } from "../services/feedbackService";
import {
  getAllCartItems,
  getUserCart,
  getUserFavorites,
  requestQuota,
  markQuotaHandled,
} from "../services/stockServices";
import ClipLoader from "react-spinners/ClipLoader";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { Tooltip } from "@mui/material";
import { Container, Table } from "react-bootstrap";

interface AdminCartProps {}

interface CartWithUsers extends Stock {
  userId: string;
  inCartBy: Array<{
    userId: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    createdAt: string;
    quantity: number;
    requestedQuota?: number;
    quotaRequestDate?: string;
    quotaHandled?: boolean;
  }>;
}

const AdminCart: FunctionComponent<AdminCartProps> = (): ReactElement => {
  const { token } = useContext(GlobalProps);
  const [cartItems, setCartItems] = useState<CartWithUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  const fetchCartItems = async (): Promise<void> => {
    if (!token) {
      setError("No authentication token found");
      errorMsg("No authentication token found");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getAllCartItems(token);
      if (response.data) {
        const mappedCartItems = response.data.map((item: CartWithUsers) => {
          return {
            ...item,
            id: item._id,
            inCartBy: item.inCartBy?.map((entry) => ({
              ...entry,
              quotaHandled: Boolean(entry.quotaHandled),
            })),
          };
        });
        setCartItems(mappedCartItems);
        setFavorites(
          new Set(mappedCartItems.map((item: CartWithUsers) => item._id || ""))
        );
      } else {
        throw new Error("No data received from server");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      console.error("Error fetching cart items:", err);
      setError(`Failed to fetch cart items - ${errorMessage}`);
      errorMsg(`Failed to fetch cart items - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCartItems();
    } else {
      setError("No authentication token found");
    }
  }, [token]);

  const renderUserTooltip = (users: CartWithUsers["inCartBy"]) => {
    return (
      <div>
        {users.map((user, index) => (
          <div
            key={user.userId}
            style={{ marginBottom: index < users.length - 1 ? "8px" : "0" }}
          >
            <div>
              <strong>Name:</strong> {user.name.first} {user.name.last}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Quantity:</strong> {user.quantity}
            </div>
            <div>
              <strong>Added:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStockTooltip = (stock: CartWithUsers) => {
    return (
      <div>
        <div>
          <strong>Brand:</strong> {stock.Brand}
        </div>
        <div>
          <strong>Model:</strong> {stock.Model}
        </div>
        <div>
          <strong>SKU:</strong> {stock.SKU}
        </div>
        <div>
          <strong>Description:</strong> {stock.Description}
        </div>
        <div>
          <strong>Price:</strong> {stock["Price (USD)"]}
        </div>
        <div>
          <strong>Condition:</strong> {stock.Condition}
        </div>
        <div>
          <strong>Location:</strong> {stock.Location}
        </div>
        <div>
          <strong>Status:</strong> {stock.Status}
        </div>
      </div>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "requestedQuota",
      headerName: "Quota Request",
      width: 150,
      sortable: true,
      renderCell: (params) => {
        const quota = params.row.requestedQuota;
        return (
          <div
            style={{
              color: quota && quota > 0 ? "#28a745" : "#6c757d",
              fontWeight: quota && quota > 0 ? "bold" : "normal",
            }}
          >
            {quota && quota > 0 ? `Requested: ${quota}` : "No Request"}
          </div>
        );
      },
    },
    {
      field: "inCartBy",
      headerName: "Added By",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const users = params.row.inCartBy || [];
        const displayText = users
          .map(
            (user: { name: { first: string; last: string } }) =>
              `${user.name.first} ${user.name.last}`
          )
          .join(", ");
        return (
          <Tooltip title={renderUserTooltip(users)} arrow>
            <div
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: "userEmail",
      headerName: "User Email",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const users = params.row.inCartBy || [];
        const displayText = users
          .map((user: { email: string }) => user.email)
          .join(", ");
        return (
          <Tooltip title={renderUserTooltip(users)} arrow>
            <div
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Tooltip title={renderStockTooltip(params.row)} arrow>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "Model",
      headerName: "Model",
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Tooltip title={renderStockTooltip(params.row)} arrow>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "SKU",
      headerName: "SKU",
      width: 130,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Tooltip title={renderStockTooltip(params.row)} arrow>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
  ];

  const handleExcelDownload = async (): Promise<void> => {
    try {
      // Transform data for Excel
      const excelData = cartItems.map((item) => ({
        ID: item.id,
        "Added By": item.inCartBy
          ?.map((user) => `${user.name.first} ${user.name.last}`)
          .join(", "),
        "User Email": item.inCartBy?.map((user) => user.email).join(", "),
        Brand: item.Brand,
        Model: item.Model,
        SKU: item.SKU,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cart Items");

      // Convert workbook to array buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cart_items_data.xlsx";
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      successMsg("Cart items data downloaded successfully");
    } catch (err) {
      errorMsg("Failed to download cart items data");
      console.error("Excel download error:", err);
    }
  };

  const handleMarkHandled = async (stockId: string) => {
    if (!token) return;

    try {
      await markQuotaHandled(stockId, token);
      // Update the local state to reflect the change
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === stockId
            ? {
                ...item,
                inCartBy: item.inCartBy?.map((entry) =>
                  entry.requestedQuota
                    ? {
                        ...entry,
                        quotaHandled: true,
                      }
                    : entry
                ),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error marking quota as handled:", error);
      errorMsg("Failed to mark quota as handled");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Brand</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>Model</th>
            <th style={{ whiteSpace: "nowrap", width: "15%" }}>SKU</th>
            <th style={{ width: "35%" }}>Description</th>
            <th style={{ width: "7.5%" }}>Favorite</th>
            <th style={{ width: "7.5%" }}>Cart</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((stock) => {
            const stockId = stock._id || "";
            const isFavorite = favorites.has(stockId);

            // Find any cart entry with a quota request for this stock
            const quotaEntries =
              stock.inCartBy?.filter((entry) => entry.requestedQuota) || [];

            // Check if all quota requests for this item are handled
            const allQuotasHandled =
              quotaEntries.length > 0 &&
              quotaEntries.every((entry) => Boolean(entry.quotaHandled));

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
                <td>{stock.Brand}</td>
                <td>{stock.Model}</td>
                <td>{stock.SKU}</td>
                <td>{stock.Description}</td>
                <td>{isFavorite ? "Yes" : "No"}</td>
                <td>{stock.inCartBy?.length || 0}</td>
                <td>
                  {quotaEntries.length > 0 && (
                    <Button
                      variant="contained"
                      color={allQuotasHandled ? "inherit" : "success"}
                      size="small"
                      onClick={() => handleMarkHandled(stockId)}
                      disabled={allQuotasHandled}
                      title={
                        allQuotasHandled ? "Already Handled" : "Mark as Handled"
                      }
                    >
                      {allQuotasHandled ? "Handled" : "Mark as Handled"}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminCart;
