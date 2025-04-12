import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  ReactElement,
} from "react";
import { GlobalProps } from "../context/GlobalContext";
import { errorMsg, successMsg } from "../services/feedbackService";
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
import { IconButton } from "@mui/material";
import {
  getCustomerRequests,
  CustomerRequest,
} from "../services/customerService";

interface AdminCustomerRequestsProps {}

const AdminCustomerRequests: FunctionComponent<
  AdminCustomerRequestsProps
> = (): ReactElement => {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "message", headerName: "Message", width: 300 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString();
      },
    },
  ];

  const fetchRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getCustomerRequests();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      errorMsg("Failed to fetch customer requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleExcelDownload = async (): Promise<void> => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(requests);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Requests");
      XLSX.writeFile(workbook, "customer_requests.xlsx");
      successMsg("Excel file downloaded successfully");
    } catch (error) {
      errorMsg("Failed to download Excel file");
    }
  };

  const handleRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ): Promise<GridRowModel> => {
    try {
      // TODO: Implement API call to update customer request status
      // await updateCustomerRequest(newRow);
      successMsg("Request updated successfully");
      return newRow;
    } catch (error) {
      errorMsg("Failed to update request");
      return oldRow;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Paper elevation={3} className="admin-paper">
        <div className="admin-header">
          <h2>Customer Requests</h2>
          <div className="admin-actions">
            <IconButton onClick={fetchRequests} title="Refresh">
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={handleExcelDownload} title="Download Excel">
              <DownloadIcon />
            </IconButton>
          </div>
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={requests}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
            processRowUpdate={handleRowUpdate}
            onProcessRowUpdateError={(error) => {
              errorMsg("Failed to update request");
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default AdminCustomerRequests;
