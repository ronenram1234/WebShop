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
import { getAllCartItems, markQuotaHandled } from "../services/stockServices";
import { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import { Tooltip } from "@mui/material";
import { Container } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";

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

  const fetchCartItems = async (): Promise<void> => {
    if (!token) {
      errorMsg("No authentication token found");
      return;
    }

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
      } else {
        throw new Error("No data received from server");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      console.error("Error fetching cart items:", err);
      errorMsg(`Failed to fetch cart items - ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCartItems();
    } else {
      errorMsg("No authentication token found");
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
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const hasUnhandledQuota = params.row.inCartBy?.some(
          (entry: { requestedQuota?: number; quotaHandled?: boolean }) =>
            entry.requestedQuota && !entry.quotaHandled
        );

        return hasUnhandledQuota ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleMarkHandled(params.row._id)}
          >
            Mark Handled
          </Button>
        ) : null;
      },
    },
  ];

  const handleExcelDownload = async (): Promise<void> => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        cartItems.map((item) => ({
          Brand: item.Brand,
          Model: item.Model,
          SKU: item.SKU,
          Description: item.Description,
          "Price (USD)": item["Price (USD)"],
          Condition: item.Condition,
          Location: item.Location,
          Status: item.Status,
          "Users in Cart": item.inCartBy?.length || 0,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cart Items");
      XLSX.writeFile(workbook, "cart_items.xlsx");
      successMsg("Excel file downloaded successfully");
    } catch (err) {
      console.error("Error downloading Excel:", err);
      errorMsg("Failed to download Excel file");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Cart</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExcelDownload}
          startIcon={<i className="fas fa-file-excel"></i>}
        >
          Download Excel
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={cartItems}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </Container>
  );
};

export default AdminCart;
