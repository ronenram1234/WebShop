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
import { getAllFavorites } from "../services/stockServices";
import ClipLoader from "react-spinners/ClipLoader";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { Tooltip } from "@mui/material";

interface AdminFavoritesProps {}

interface FavoriteWithUsers extends Stock {
  favoritedBy: Array<{
    userId: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    createdAt: string;
  }>;
}

const AdminFavorites: FunctionComponent<
  AdminFavoritesProps
> = (): ReactElement => {
  const { token } = useContext(GlobalProps);
  const [favorites, setFavorites] = useState<FavoriteWithUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchFavorites = async (): Promise<void> => {
    if (!token) {
      setError("No authentication token found");
      errorMsg("No authentication token found");
      return;
    }

    setLoading(true);
    try {
      const res = await getAllFavorites(token);
      if (res?.data) {
        const mappedFavorites = res.data.map((stock: FavoriteWithUsers) => ({
          ...stock,
          id: stock._id,
        }));
        setFavorites(mappedFavorites);
      } else {
        throw new Error("No data received from server");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      console.error("Error fetching favorites:", err);
      setError(`Failed to fetch favorites - ${errorMessage}`);
      errorMsg(`Failed to fetch favorites - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorites();
    } else {
      setError("No authentication token found");
    }
  }, [token]);

  const renderUserTooltip = (users: FavoriteWithUsers["favoritedBy"]) => {
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
              <strong>Added:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStockTooltip = (stock: FavoriteWithUsers) => {
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
      field: "favoritedBy",
      headerName: "Favorited By",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const users = params.row.favoritedBy || [];
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
        const users = params.row.favoritedBy || [];
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
      const excelData = favorites.map((favorite) => ({
        ID: favorite.id,
        "Favorited By": favorite.favoritedBy
          ?.map((user) => `${user.name.first} ${user.name.last}`)
          .join(", "),
        "User Email": favorite.favoritedBy
          ?.map((user) => user.email)
          .join(", "),
        Brand: favorite.Brand,
        Model: favorite.Model,
        SKU: favorite.SKU,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Favorites");

      // Convert workbook to array buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "favorites_data.xlsx";
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      successMsg("Favorites data downloaded successfully");
    } catch (err) {
      errorMsg("Failed to download favorites data");
      console.error("Excel download error:", err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bolder">Favorites Table</h1>
        <div className="d-flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExcelDownload}
            disabled={loading || favorites.length === 0}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchFavorites}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <ClipLoader loading={loading} size={50} color="#00bcd4" />
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <Paper
          sx={{
            height: "70vh",
            width: "100%",
            border: "2px solid #000",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={favorites}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: [],
                },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            disableColumnFilter={false}
            disableColumnSelector={false}
            disableDensitySelector={false}
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </div>
  );
};

export default AdminFavorites;
