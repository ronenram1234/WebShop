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
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      message: yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const res=await submitCustomerRequest(values);
        // alert(res);
        successMsg(res)
        formik.resetForm();
      } catch (error) {
        alert("There was an error submitting your request. Please try again.");
      }
    },
  });

  return (
    <div className="container py-4">
      <p className="h1">Sell To Us</p>
      <p className="h4 my-4">
        Tinkertech purchases many types of components and peripherals including
        memory, processors, hard drives, and more. Connect with us today to see
        what your equipment is worth!
      </p>
      <img
        src="selltous.jpg"
        className="img-fluid my-4"
        alt="selltous"
        style={{ width: "50%", height: "50%" }}
      />

      <div className="border border-primary p-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
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
            />
          </div>

          <div className="mb-3">
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
            />
          </div>

          <div className="mb-3">
            <TextField
              variant="outlined"
              label="Message"
              type="text"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
           
            />
          </div>
     

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellToUs;
