import { Alert, CircularProgress } from "@mui/material";
import Button from "components/Button";
import CustomInput from "components/Form/CustomInput";
import TopBar from "components/TopBar";
import { UserType } from "common/models/User";
import { useFormik } from "formik";
import "pages/styles/Login.scss";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, registerUser } from "services/authService";
import * as Yup from "yup";

interface Props {}

export default function Register(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<UserType>(UserType.CANDIDATE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get("user");

    if (isLoggedIn()) {
      navigate("/dashboard");
      return;
    }

    if (user === UserType.RECRUITER) {
      setUserType(UserType.RECRUITER);
    }
  }, [location.search, navigate]);

  const handleFormSubmit = async (values: FormElements) => {
    setIsLoading(true);
    try {
      const response = await registerUser(values.email, values.password, values.username, userType);
      if (response) {
        navigate(`/login?user=${userType}&email=${values.email}`);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use");
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserType = () => {
    const newUserType = userType === UserType.CANDIDATE ? UserType.RECRUITER : UserType.CANDIDATE;
    setUserType(newUserType);
    navigate(`?user=${newUserType}`, { replace: true });
  };

  const navigateToLoginPage = () => {
    navigate(`/login?user=${userType}`);
  };

  const formik = useFormik<FormElements>({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, "Must be at least 6 characters")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <>
      <TopBar />
      <div className="login-container">
        <div className="login-section">
          <div className="login-section-content">
            <h2>Register as {userType}</h2>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <form className="login-form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <CustomInput
                  id="email"
                  label="Mail Id"
                  fullWidth
                  {...formik.getFieldProps("email")}
                  errorMessage={
                    formik.touched.email && formik.errors.email ? formik.errors.email : null
                  }
                />
              </div>
              <div className="form-group">
                <CustomInput
                  id="username"
                  label="Username"
                  fullWidth
                  {...formik.getFieldProps("username")}
                  errorMessage={
                    formik.touched.username && formik.errors.username
                      ? formik.errors.username
                      : null
                  }
                />
              </div>
              <div className="form-group">
                <CustomInput
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  {...formik.getFieldProps("password")}
                  errorMessage={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : null
                  }
                />
              </div>
              <Button type="submit" size="xl" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <CircularProgress size={20} thickness={4} />
                    <span pl-4>Registering...</span>
                  </>
                ) : (
                  "Register"
                )}
              </Button>
              <p className="account-text">
                Have an account?{" "}
                <span className="btn" onClick={navigateToLoginPage}>
                  Login
                </span>
                .<br />
                <br />
                <span className="btn" onClick={switchUserType}>
                  Register as{" "}
                  {userType === UserType.CANDIDATE ? UserType.RECRUITER : UserType.CANDIDATE}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

interface FormElements {
  username: string;
  password: string;
  email: string;
}
