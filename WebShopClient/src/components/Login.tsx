import { FunctionComponent, useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserLoginFormValues } from "../interfaces/User";
import { getUserToken, setTokenLocalStorage } from "../services/userServices";
import { GlobalProps } from "../context/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { errorMsg } from "../services/feedbackService";

interface LoginProps {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: FunctionComponent<LoginProps> = ({ setIsRegister }) => {
  const { setToken, setIsUsserLogedin } = useContext(GlobalProps);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik<UserLoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      getUserToken(values)
        .then((res) => {
          if (res.data.length > 0) {
            setToken(res.data);
            setTokenLocalStorage(res.data);
            setIsUsserLogedin(true);
          } else {
            errorMsg("Invalid email or password");
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            errorMsg("Invalid email or password");
          } else if (err.response?.status === 404) {
            errorMsg("User not found");
          } else {
            errorMsg("An error occurred during login. Please try again later.");
          }
        });
    },
  });

  return (
    <div className="login-container">
      <form onSubmit={formik.handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${
              formik.touched.email && formik.errors.email ? "is-invalid" : ""
            }`}
            id="email"
            placeholder="name@example.com"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="username"
          />
          <label htmlFor="email">Email</label>
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-floating mb-3">
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
            autoComplete="current-password"
          />
          <label htmlFor="password">Password</label>
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

        <button
          className="btn btn-primary w-100 auth-submit-btn"
          type="submit"
          disabled={!formik.dirty || !formik.isValid}
        >
          Sign In
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className="auth-link-btn"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
