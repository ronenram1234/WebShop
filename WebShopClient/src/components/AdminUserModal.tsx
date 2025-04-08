import { FunctionComponent, useState, useEffect, ReactElement } from "react";
import { UserAdmin } from "../interfaces/User";
import { errorMsg, successMsg } from "../services/feedbackService";
import { updateUser } from "../services/userServices";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserAdmin | null;
  token: string;
  currentUserId: string;
  onSuccess: () => void;
}

const AdminUserModal: FunctionComponent<AdminUserModalProps> = ({
  open,
  onClose,
  user,
  token,
  currentUserId,
  onSuccess,
}): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      nameFirst: "",
      nameMiddle: "",
      nameLast: "",
      phone: "",
      addressState: "",
      addressCountry: "",
      addressCity: "",
      addressStreet: "",
      addressHouseNumber: 0,
      addressZip: 0,
      isAdmin: "false",
    },
    validationSchema: yup.object({
      nameFirst: yup
        .string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(256, "First name cannot exceed 256 characters"),
      nameMiddle: yup.string().optional(),
      nameLast: yup
        .string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(256, "Last name cannot exceed 256 characters"),
      phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]{9,10}$/, "Phone number must be 9-10 digits"),
      addressState: yup.string().optional(),
      addressCountry: yup
        .string()
        .required("Country is required")
        .min(2, "Country must be at least 2 characters")
        .max(256, "Country cannot exceed 256 characters"),
      addressCity: yup
        .string()
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(256, "City cannot exceed 256 characters"),
      addressStreet: yup
        .string()
        .required("Street is required")
        .min(2, "Street must be at least 2 characters")
        .max(256, "Street cannot exceed 256 characters"),
      addressHouseNumber: yup
        .number()
        .required("House number is required")
        .min(1, "House number must be positive")
        .positive("House number must be positive")
        .integer("House number must be an integer"),
      addressZip: yup
        .number()
        .required("ZIP code is required")
        .positive("ZIP code must be positive")
        .integer("ZIP code must be an integer"),
      isAdmin: yup.string().oneOf(["true", "false"], "Invalid admin status"),
    }),
    onSubmit: async (values) => {
      if (!user || !token) return;

      setLoading(true);
      try {
        const updatedFields: { [key: string]: any } = {};

        // Handle name fields
        updatedFields.name = {
          first: values.nameFirst,
          middle: values.nameMiddle || "",
          last: values.nameLast,
        };

        // Handle address fields
        updatedFields.address = {
          state: values.addressState || "",
          country: values.addressCountry,
          city: values.addressCity,
          street: values.addressStreet,
          houseNumber: values.addressHouseNumber,
          zip: values.addressZip,
        };

        // Handle other fields
        updatedFields.phone = values.phone;
        updatedFields.isAdmin = values.isAdmin === "true";

        await updateUser(user.id, updatedFields, token);
        successMsg("User updated successfully");
        onSuccess();
        onClose();
      } catch (err: any) {
        const errorMessage =
          err.response?.data || err.message || "Failed to update user";
        errorMsg(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        nameFirst: user.nameFirst,
        nameMiddle: user.nameMiddle || "",
        nameLast: user.nameLast,
        phone: user.phone,
        addressState: user.addressState || "",
        addressCountry: user.addressCountry,
        addressCity: user.addressCity,
        addressStreet: user.addressStreet,
        addressHouseNumber: user.addressHouseNumber,
        addressZip: user.addressZip,
        isAdmin: user.isAdmin,
      });
    }
  }, [user]);

  const handleDelete = async () => {
    if (!user?.id) return;
    try {
      await deleteUser(user.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  if (!user) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-center">Update User</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {/* Name Row */}
          <div className="d-flex justify-content-center align-items-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.nameFirst && formik.errors.nameFirst
                    ? "is-invalid"
                    : ""
                }`}
                id="nameFirst"
                placeholder="First name"
                name="nameFirst"
                value={formik.values.nameFirst}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="nameFirst">First name*</label>
              {formik.touched.nameFirst && formik.errors.nameFirst && (
                <div className="invalid-feedback">
                  {formik.errors.nameFirst}
                </div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.nameMiddle && formik.errors.nameMiddle
                    ? "is-invalid"
                    : ""
                }`}
                id="nameMiddle"
                placeholder="Middle name"
                name="nameMiddle"
                value={formik.values.nameMiddle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="nameMiddle">Middle name</label>
              {formik.touched.nameMiddle && formik.errors.nameMiddle && (
                <div className="invalid-feedback">
                  {formik.errors.nameMiddle}
                </div>
              )}
            </div>
          </div>

          {/* Last Name and Phone Row */}
          <div className="d-flex justify-content-center align-items-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.nameLast && formik.errors.nameLast
                    ? "is-invalid"
                    : ""
                }`}
                id="nameLast"
                placeholder="Last name"
                name="nameLast"
                value={formik.values.nameLast}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="nameLast">Last name*</label>
              {formik.touched.nameLast && formik.errors.nameLast && (
                <div className="invalid-feedback">{formik.errors.nameLast}</div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="tel"
                className={`form-control ${
                  formik.touched.phone && formik.errors.phone
                    ? "is-invalid"
                    : ""
                }`}
                id="phone"
                placeholder="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="phone">Phone*</label>
              {formik.touched.phone && formik.errors.phone && (
                <div className="invalid-feedback">{formik.errors.phone}</div>
              )}
            </div>
          </div>

          {/* State and Country Row */}
          <div className="d-flex justify-content-center align-items-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.addressState && formik.errors.addressState
                    ? "is-invalid"
                    : ""
                }`}
                id="addressState"
                placeholder="State"
                name="addressState"
                value={formik.values.addressState}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressState">State</label>
              {formik.touched.addressState && formik.errors.addressState && (
                <div className="invalid-feedback">
                  {formik.errors.addressState}
                </div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.addressCountry && formik.errors.addressCountry
                    ? "is-invalid"
                    : ""
                }`}
                id="addressCountry"
                placeholder="Country"
                name="addressCountry"
                value={formik.values.addressCountry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressCountry">Country*</label>
              {formik.touched.addressCountry &&
                formik.errors.addressCountry && (
                  <div className="invalid-feedback">
                    {formik.errors.addressCountry}
                  </div>
                )}
            </div>
          </div>

          {/* City and Street Row */}
          <div className="d-flex justify-content-center align-items-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.addressCity && formik.errors.addressCity
                    ? "is-invalid"
                    : ""
                }`}
                id="addressCity"
                placeholder="City"
                name="addressCity"
                value={formik.values.addressCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressCity">City*</label>
              {formik.touched.addressCity && formik.errors.addressCity && (
                <div className="invalid-feedback">
                  {formik.errors.addressCity}
                </div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.addressStreet && formik.errors.addressStreet
                    ? "is-invalid"
                    : ""
                }`}
                id="addressStreet"
                placeholder="Street"
                name="addressStreet"
                value={formik.values.addressStreet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressStreet">Street*</label>
              {formik.touched.addressStreet && formik.errors.addressStreet && (
                <div className="invalid-feedback">
                  {formik.errors.addressStreet}
                </div>
              )}
            </div>
          </div>

          {/* House Number and ZIP Row */}
          <div className="d-flex justify-content-center align-items-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="number"
                className={`form-control ${
                  formik.touched.addressHouseNumber &&
                  formik.errors.addressHouseNumber
                    ? "is-invalid"
                    : ""
                }`}
                id="addressHouseNumber"
                placeholder="House Number"
                name="addressHouseNumber"
                value={formik.values.addressHouseNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressHouseNumber">House Number*</label>
              {formik.touched.addressHouseNumber &&
                formik.errors.addressHouseNumber && (
                  <div className="invalid-feedback">
                    {formik.errors.addressHouseNumber}
                  </div>
                )}
            </div>

            <div className="form-floating col-6">
              <input
                type="number"
                className={`form-control ${
                  formik.touched.addressZip && formik.errors.addressZip
                    ? "is-invalid"
                    : ""
                }`}
                id="addressZip"
                placeholder="ZIP"
                name="addressZip"
                value={formik.values.addressZip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="addressZip">ZIP*</label>
              {formik.touched.addressZip && formik.errors.addressZip && (
                <div className="invalid-feedback">
                  {formik.errors.addressZip}
                </div>
              )}
            </div>
          </div>

          {/* Admin Switch */}
          <div className="d-flex justify-content-center align-items-center mt-4">
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isAdmin === "true"}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "isAdmin",
                      e.target.checked ? "true" : "false"
                    );
                  }}
                  color="primary"
                />
              }
              label={
                <span
                  style={{
                    marginLeft: "8px",
                    color:
                      formik.values.isAdmin === "true" ? "#2196f3" : "inherit",
                  }}
                >
                  {formik.values.isAdmin === "true" ? "Admin" : "Not Admin"}
                </span>
              }
            />
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <Button
            onClick={onClose}
            variant="outlined"
            className="me-3"
            style={{ minWidth: "100px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formik.isValid}
            style={{ minWidth: "100px" }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminUserModal;
