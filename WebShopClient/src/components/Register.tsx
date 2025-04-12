import { FunctionComponent, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserReg } from "../interfaces/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { errorMsg } from "../services/feedbackService";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userServices";
import { AxiosError } from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

interface RegisterProps {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: FunctionComponent<RegisterProps> = ({ setIsRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik<UserReg>({
    initialValues: {
      name: {
        first: "",
        middle: "",
        last: "",
      },
      phone: "",
      email: "",
      password: "",
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: 0,
        zip: 0,
      },
    },
    validationSchema: yup.object({
      name: yup.object({
        first: yup.string().required().min(2).max(256),
        middle: yup.string().optional(),
        last: yup.string().required().min(2).max(256),
      }),
      phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]{9,10}$/, "Phone number must be 9-10 digits"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password cannot exceed 20 characters")
        .matches(
          /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/,
          "Password must contain at least one letter and one number"
        ),
      address: yup.object({
        state: yup.string().optional(),
        country: yup.string().required().min(2).max(256),
        city: yup.string().required().min(2).max(256),
        street: yup.string().required().min(2).max(256),
        houseNumber: yup.number().required().min(1).positive().integer(),
        zip: yup
          .number()
          .required()
          .positive("ZIP code must be positive")
          .integer("ZIP code must be an integer"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const res = await createUser(values);
        if (res.status === 201) {
          navigate("/login");
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        errorMsg(error.response?.data?.message || "Registration failed");
      }
    },
  });

  return (
    <>
      <div className="container d-flex justify-content-center align-item-center flex-column col-12">
        <h5 className="display-5 my-2">Register</h5>
        <form onSubmit={formik.handleSubmit}>
          {/* line 1 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name?.first && formik.errors.name?.first
                    ? "is-invalid"
                    : ""
                }`}
                id="name.first"
                placeholder="First name"
                name="name.first"
                value={formik.values.name.first}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="name.first">First name*</label>
              {formik.touched.name?.first && formik.errors.name?.first && (
                <div className="invalid-feedback">
                  {formik.errors.name.first}
                </div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name?.middle && formik.errors.name?.middle
                    ? "is-invalid"
                    : ""
                }`}
                id="name.middle"
                placeholder="Middle name"
                name="name.middle"
                value={formik.values.name.middle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="name.middle">Middle name</label>
              {formik.touched.name?.middle && formik.errors.name?.middle && (
                <div className="invalid-feedback">
                  {formik.errors.name.middle}
                </div>
              )}
            </div>
          </div>

          {/* line 2 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name?.last && formik.errors.name?.last
                    ? "is-invalid"
                    : ""
                }`}
                id="name.last"
                placeholder="Last name"
                name="name.last"
                value={formik.values.name.last}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="name.last">Last name*</label>
              {formik.touched.name?.last && formik.errors.name?.last && (
                <div className="invalid-feedback">
                  {formik.errors.name.last}
                </div>
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

          {/* line 3 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                id="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="username"
              />
              <label htmlFor="email">Email*</label>
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="form-floating col-6 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                id="password"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="new-password"
              />
              <label htmlFor="password">Password*</label>
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                onClick={togglePasswordVisibility}
                style={{ zIndex: 5 }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
          </div>

          {/* line 5 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.address?.state && formik.errors.address?.state
                    ? "is-invalid"
                    : ""
                }`}
                id="address.state"
                placeholder="State"
                name="address.state"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.state">State</label>
              {formik.touched.address?.state &&
                formik.errors.address?.state && (
                  <div className="invalid-feedback">
                    {formik.errors.address.state}
                  </div>
                )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.address?.country &&
                  formik.errors.address?.country
                    ? "is-invalid"
                    : ""
                }`}
                id="address.country"
                placeholder="Country"
                name="address.country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.country">Country*</label>
              {formik.touched.address?.country &&
                formik.errors.address?.country && (
                  <div className="invalid-feedback">
                    {formik.errors.address.country}
                  </div>
                )}
            </div>
          </div>

          {/* line 6 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.address?.city && formik.errors.address?.city
                    ? "is-invalid"
                    : ""
                }`}
                id="address.city"
                placeholder="City"
                name="address.city"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.city">City*</label>
              {formik.touched.address?.city && formik.errors.address?.city && (
                <div className="invalid-feedback">
                  {formik.errors.address.city}
                </div>
              )}
            </div>

            <div className="form-floating col-6">
              <input
                type="text"
                className={`form-control ${
                  formik.touched.address?.street &&
                  formik.errors.address?.street
                    ? "is-invalid"
                    : ""
                }`}
                id="address.street"
                placeholder="Street"
                name="address.street"
                value={formik.values.address.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.street">Street*</label>
              {formik.touched.address?.street &&
                formik.errors.address?.street && (
                  <div className="invalid-feedback">
                    {formik.errors.address.street}
                  </div>
                )}
            </div>
          </div>

          {/* line 7 */}
          <div className="d-flex justify-content-center align-item-center flex-row col-12 mt-4">
            <div className="form-floating mx-3 col-6">
              <input
                type="number"
                className={`form-control ${
                  formik.touched.address?.houseNumber &&
                  formik.errors.address?.houseNumber
                    ? "is-invalid"
                    : ""
                }`}
                id="address.houseNumber"
                placeholder="House Number"
                name="address.houseNumber"
                value={formik.values.address.houseNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.houseNumber">House Number*</label>
              {formik.touched.address?.houseNumber &&
                formik.errors.address?.houseNumber && (
                  <div className="invalid-feedback">
                    {formik.errors.address.houseNumber}
                  </div>
                )}
            </div>

            <div className="form-floating col-6">
              <input
                type="number"
                className={`form-control ${
                  formik.touched.address?.zip && formik.errors.address?.zip
                    ? "is-invalid"
                    : ""
                }`}
                id="address.zip"
                placeholder="ZIP"
                name="address.zip"
                value={formik.values.address.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="address.zip">ZIP*</label>
              {formik.touched.address?.zip && formik.errors.address?.zip && (
                <div className="invalid-feedback">
                  {formik.errors.address.zip}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={!formik.isValid || !formik.dirty}
          >
            Register
          </button>

          <div className="auth-footer mt-3">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="auth-link-btn"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
