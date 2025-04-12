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
import { getAllStocks } from "../services/getStocks";
import { updateStock } from "../services/stockServices";
import ClipLoader from "react-spinners/ClipLoader";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

// Add TypeScript declarations for the File System Access API
declare global {
  interface Window {
    showSaveFilePicker(options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle>;
  }
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface AdminProductsProps {}

interface GridStock extends Stock {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  Quantity: number;
  Detail: string;
  "Product Category": string;
  "Part Number": string;
  "Serial Number": string;
}

const AdminProducts: FunctionComponent<
  AdminProductsProps
> = (): ReactElement => {
  const { token } = useContext(GlobalProps);
  const [products, setProducts] = useState<GridStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const fetchProducts = async (): Promise<void> => {
    if (!token) {
      setError("No authentication token found");
      errorMsg("No authentication token found");
      return;
    }

    setLoading(true);
    try {
      const res = await getAllStocks(token);
      if (res?.data) {
        const mappedProducts = res.data.map((product: Stock) => ({
          ...product,
          id: product._id || "",
          _id: product._id || "",
        }));
        setProducts(mappedProducts);
      } else {
        throw new Error("No data received from server");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      console.error("Error fetching products:", err);
      setError(`Failed to fetch products - ${errorMessage}`);
      errorMsg(`Failed to fetch products - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      setError("No authentication token found");
    }
  }, [token]);

  const columns: GridColDef[] = [
    {
      field: "Brand",
      headerName: "Brand",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Model",
      headerName: "Model",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "SKU",
      headerName: "SKU",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 100,
      type: "number",
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Price (USD)",
      headerName: "Price (USD)",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Condition",
      headerName: "Condition",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 200,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Detail",
      headerName: "Detail",
      width: 200,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Product Category",
      headerName: "Category",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Part Number",
      headerName: "Part Number",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Serial Number",
      headerName: "Serial Number",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Location",
      headerName: "Location",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      type: "dateTime",
      sortable: true,
      filterable: true,
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 180,
      type: "dateTime",
      sortable: true,
      filterable: true,
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      },
    },
  ];

  const handleExcelDownload = async (): Promise<void> => {
    try {
      // Transform data for Excel
      const excelData = products.map((product) => ({
        ID: product._id,
        Brand: product.Brand,
        Model: product.Model,
        SKU: product.SKU,
        Quantity: product.Quantity || 0,
        "Price (USD)": product["Price (USD)"],
        Condition: product.Condition,
        Description: product.Description,
        Detail: product.Detail || "",
        "Product Category": product["Product Category"] || "",
        "Part Number": product["Part Number"] || "",
        "Serial Number": product["Serial Number"] || "",
        Location: product.Location,
        Status: product.Status,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Convert workbook to array buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link with file picker
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "products_data.xlsx";

      // Use the showSaveFilePicker API if available, otherwise fallback to regular download
      if ("showSaveFilePicker" in window) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: "products_data.xlsx",
            types: [
              {
                description: "Excel Spreadsheet",
                accept: {
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    [".xlsx"],
                },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          successMsg("Products data saved successfully");
        } catch (err: unknown) {
          // User cancelled the save dialog
          if (err instanceof Error && err.name !== "AbortError") {
            throw err;
          }
        }
      } else {
        // Fallback for browsers that don't support showSaveFilePicker
        link.click();
        successMsg("Products data downloaded successfully");
      }

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      errorMsg("Failed to download products data");
      console.error("Excel download error:", err);
    }
  };

  const handleRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ): Promise<GridRowModel> => {
    if (updateLoading) return oldRow;

    const updatedFields: { [key: string]: any } = {};

    // Check which fields have changed and exclude date fields
    Object.keys(newRow).forEach((key) => {
      if (
        newRow[key] !== oldRow[key] &&
        key !== "id" &&
        key !== "_id" &&
        key !== "createdAt" &&
        key !== "updatedAt"
      ) {
        updatedFields[key] = newRow[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) return oldRow;

    setUpdateLoading(true);
    try {
      await updateStock(newRow._id as string, updatedFields, token);
      successMsg("Product updated successfully");
      return newRow;
    } catch (err: any) {
      const errorMessage =
        err.response?.data || err.message || "Failed to update product";
      errorMsg(errorMessage);
      return oldRow;
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bolder">Products Table</h1>
        <div className="d-flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExcelDownload}
            disabled={loading || products.length === 0}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchProducts}
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
            rows={products}
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
            processRowUpdate={handleRowUpdate}
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

export default AdminProducts;
