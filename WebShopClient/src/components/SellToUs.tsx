import { FunctionComponent } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import { submitCustomerRequest } from "../services/customerService";
import { successMsg } from "../services/feedbackService";

// interface SellToUsProps {

// }

// const SellToUs: FunctionComponent<SellToUsProps> = () => {
const SellToUs: FunctionComponent = () => {
  // console.log("sell to us");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      message: yup.string(),
      phone: yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await submitCustomerRequest({
          ...values,
          phone: values.phone || "",
        });
        successMsg("Your request has been submitted successfully");
        formik.resetForm();
      } catch (error) {
        alert("There was an error submitting your request. Please try again.");
      }
    },
  });

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold mb-4">Sell To Us</h1>
          <p className="lead mb-4">
            Tinkertech purchases many types of components and peripherals
            including memory, processors, hard drives, and more. Connect with us
            today to see what your equipment is worth!
          </p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <div className="badge bg-primary p-2">Memory</div>
            <div className="badge bg-primary p-2">Processors</div>
            <div className="badge bg-primary p-2">Hard Drives</div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <img
            src="selltous.jpg"
            className="img-fluid rounded shadow-lg"
            alt="Sell to us"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <TextField
                    variant="outlined"
                    label="Name*"
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="username"
                    fullWidth
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    className="auth-input"
                  />
                </div>

                <div className="mb-4">
                  <TextField
                    variant="outlined"
                    label="Email*"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="username"
                    fullWidth
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    className="auth-input"
                  />
                </div>

                <div className="mb-4">
                  <TextField
                    variant="outlined"
                    label="Phone"
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    className="auth-input"
                  />
                </div>

                <div className="mb-4">
                  <TextField
                    variant="outlined"
                    label="Message"
                    type="text"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    multiline
                    rows={4}
                    className="auth-input"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 py-2 auth-submit-btn"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellToUs;
