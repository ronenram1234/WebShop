import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  ReactElement,
} from "react";
import { GlobalProps } from "../context/GlobalContext";
import { UserAdmin } from "../interfaces/User";
import { errorMsg, successMsg } from "../services/feedbackService";
import { getAllUsersDetail, updateUser } from "../services/userServices";
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
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import AdminUserModal from "./AdminUserModal";

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

interface AdminUsersProps {}

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserAdmin | null;
  onUpdate: (updatedUser: Partial<UserAdmin>) => Promise<void>;
  currentUserId: string;
}

const UpdateUserModal: FunctionComponent<UpdateUserModalProps> = ({
  open,
  onClose,
  user,
  onUpdate,
  currentUserId,
}) => {
  const [formData, setFormData] = useState<Partial<UserAdmin>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nameFirst: user.nameFirst,
        nameMiddle: user.nameMiddle,
        nameLast: user.nameLast,
        phone: user.phone,
        addressState: user.addressState,
        addressCountry: user.addressCountry,
        addressCity: user.addressCity,
        addressStreet: user.addressStreet,
        addressHouseNumber: user.addressHouseNumber,
        addressZip: user.addressZip,
        isAdmin: user.isAdmin,
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <div className="d-flex flex-column gap-3 mt-3">
          <TextField
            label="First Name"
            value={formData.nameFirst || ""}
            onChange={(e) =>
              setFormData({ ...formData, nameFirst: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Middle Name"
            value={formData.nameMiddle || ""}
            onChange={(e) =>
              setFormData({ ...formData, nameMiddle: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Last Name"
            value={formData.nameLast || ""}
            onChange={(e) =>
              setFormData({ ...formData, nameLast: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Country"
            value={formData.addressCountry || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressCountry: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="State"
            value={formData.addressState || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressState: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="City"
            value={formData.addressCity || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressCity: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Street"
            value={formData.addressStreet || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressStreet: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="House Number"
            type="number"
            value={formData.addressHouseNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                addressHouseNumber: parseInt(e.target.value),
              })
            }
            fullWidth
          />
          <TextField
            label="ZIP Code"
            type="number"
            value={formData.addressZip || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressZip: parseInt(e.target.value) })
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAdmin === "true"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isAdmin: e.target.checked ? "true" : "false",
                  })
                }
                disabled={user.id === currentUserId}
              />
            }
            label="Admin"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminUsers: FunctionComponent<AdminUsersProps> = (): ReactElement => {
  const { token, currentUser } = useContext(GlobalProps);
  const [userAdmins, setUserAdmins] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchUsers = async (): Promise<void> => {
    if (!token) {
      setError("No authentication token found");
      errorMsg("No authentication token found");
      return;
    }

    setLoading(true);
    try {
      const res = await getAllUsersDetail(token);
      if (res?.data) {
        const mappedUsers = res.data.map(
          (user: {
            _id: string;
            name: {
              first: string;
              middle: string;
              last: string;
            };
            address: {
              state: string;
              country: string;
              city: string;
              street: string;
              houseNumber: number;
              zip: number;
            };
          }) => ({
            ...user,
            id: user._id,
            nameFirst: user.name.first,
            nameMiddle: user.name.middle,
            nameLast: user.name.last,
            addressState: user.address.state,
            addressCountry: user.address.country,
            addressCity: user.address.city,
            addressStreet: user.address.street,
            addressHouseNumber: user.address.houseNumber,
            addressZip: user.address.zip,
          })
        );
        setUserAdmins(mappedUsers);
      } else {
        throw new Error("No data received from server");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      console.error("Error fetching users:", err);
      setError(`Failed to fetch users - ${errorMessage}`);
      errorMsg(`Failed to fetch users - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError("No authentication token found");
    }
  }, [token]);

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setSelectedUser(params.row);
            setModalOpen(true);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "nameFirst",
      headerName: "First Name",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "nameMiddle",
      headerName: "Middle Name",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "nameLast",
      headerName: "Last Name",
      width: 130,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 160,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      sortable: true,
      filterable: true,
      editable: false,
    },
    {
      field: "addressCountry",
      headerName: "Country",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "addressState",
      headerName: "State",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "addressCity",
      headerName: "City",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "addressStreet",
      headerName: "Street",
      width: 180,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "addressHouseNumber",
      headerName: "House Number",
      width: 120,
      sortable: true,
      filterable: true,
      type: "number",
      editable: true,
    },
    {
      field: "addressZip",
      headerName: "ZIP Code",
      width: 120,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      field: "isAdmin",
      headerName: "Admin",
      width: 100,
      sortable: true,
      filterable: true,
      type: "singleSelect",
      valueOptions: ["true", "false"],
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
  ];

  const handleExcelDownload = async (): Promise<void> => {
    try {
      // Transform data for Excel - excluding password
      const excelData = userAdmins.map((user) => ({
        ID: user.id,
        "First Name": user.nameFirst,
        "Middle Name": user.nameMiddle || "",
        "Last Name": user.nameLast,
        Phone: user.phone,
        Email: user.email,
        Country: user.addressCountry,
        State: user.addressState,
        City: user.addressCity,
        Street: user.addressStreet,
        "House Number": user.addressHouseNumber,
        "ZIP Code": user.addressZip,
        Admin: user.isAdmin,
        "Created At": new Date(user.createdAt).toLocaleString(),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");

      // Convert workbook to array buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link with file picker
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "users_data.xlsx";

      // Use the showSaveFilePicker API if available, otherwise fallback to regular download
      if ("showSaveFilePicker" in window) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: "users_data.xlsx",
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
          successMsg("Users data saved successfully");
        } catch (err: unknown) {
          // User cancelled the save dialog
          if (err instanceof Error && err.name !== "AbortError") {
            throw err;
          }
        }
      } else {
        // Fallback for browsers that don't support showSaveFilePicker
        link.click();
        successMsg("Users data downloaded successfully");
      }

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      errorMsg("Failed to download users data");
      console.error("Excel download error:", err);
    }
  };

  const handleRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ): Promise<GridRowModel> => {
    if (loading) return oldRow;

    const updatedFields: { [key: string]: any } = {};
    const nameFields = new Set<string>();
    const addressFields = new Set<string>();

    // Check which fields have changed
    Object.keys(newRow).forEach((key) => {
      if (newRow[key] !== oldRow[key]) {
        if (key.startsWith("name")) {
          const nameField = key.replace("name", "").toLowerCase();
          nameFields.add(nameField);
        } else if (key.startsWith("address")) {
          const addressField = key.replace("address", "").toLowerCase();
          addressFields.add(addressField);
        } else if (key === "isAdmin") {
          updatedFields[key] = newRow[key] === "true";
        } else {
          updatedFields[key] = newRow[key];
        }
      }
    });

    // If name fields were updated, include all name fields
    if (nameFields.size > 0) {
      updatedFields.name = {
        first: newRow.nameFirst || oldRow.nameFirst,
        middle: newRow.nameMiddle || oldRow.nameMiddle || "",
        last: newRow.nameLast || oldRow.nameLast,
      };
    }

    // If address fields were updated, include all address fields
    if (addressFields.size > 0) {
      updatedFields.address = {
        state: newRow.addressState || oldRow.addressState || "",
        country: newRow.addressCountry || oldRow.addressCountry,
        city: newRow.addressCity || oldRow.addressCity,
        street: newRow.addressStreet || oldRow.addressStreet,
        houseNumber: newRow.addressHouseNumber || oldRow.addressHouseNumber,
        zip: newRow.addressZip || oldRow.addressZip,
      };
    }

    if (Object.keys(updatedFields).length === 0) return oldRow;

    setLoading(true);
    try {
      await updateUser(newRow.id, updatedFields, token);
      successMsg("User updated successfully");
      return newRow;
    } catch (err: any) {
      const errorMessage =
        err.response?.data || err.message || "Failed to update user";
      errorMsg(errorMessage);
      return oldRow;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bolder">Users Table</h1>
        <div className="d-flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExcelDownload}
            disabled={loading || userAdmins.length === 0}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
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
            rows={userAdmins}
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
      <AdminUserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        token={token || ""}
        currentUserId={currentUser?._id || ""}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default AdminUsers;
