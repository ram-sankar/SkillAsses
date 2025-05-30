import { CircularProgress, TextField } from "@mui/material";
import Button from "components/Button";
import TopBar from "components/TopBar";
import { UserType } from "common/models/User";
import "pages/styles/Login.scss";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, loginUser } from "services/authService";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Alert } from "@mui/material";
import CustomInput from "components/Form/CustomInput";

interface Props {}

interface FormValues {
  email: string;
  password: string;
}

export default function Login(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<UserType>(UserType.CANDIDATE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get("user");
    const emailParam = queryParams.get("email");

    if (isLoggedIn()) {
      navigate("/dashboard");
      return;
    }

    if (user === UserType.RECRUITER) {
      setUserType(UserType.RECRUITER);
    }
    if (emailParam) {
      formik.setValues({ ...formik.values, email: emailParam }); // Pre-populate email
    }
  }, []);

  const handleLogin = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await loginUser(values.email, values.password, userType);
      if (response.user && response.idToken) {
        navigate("/dashboard");
      } else {
        setErrorMessage("Login failed. Invalid credentials.");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid credentials.");
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: handleLogin,
  });

  const navigateToRegisterPage = () => {
    navigate(`/register?user=${userType}`);
  };

  const switchUserType = () => {
    const newUserType =
      userType === UserType.CANDIDATE ? UserType.RECRUITER : UserType.CANDIDATE;
    setUserType(newUserType);
    navigate(`?user=${newUserType}`, { replace: true });
  };

  return (
    <>
      <TopBar />
      <div className="login-container">
        <div className="login-section">
          <div className="login-section-content">
            <h2>{userType} Login</h2>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <form className="login-form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <CustomInput //Assuming you have this component
                  id="email"
                  label="Enter mail ID"
                  variant="outlined"
                  fullWidth
                  {...formik.getFieldProps("email")}
                  errorMessage={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : null
                  }
                />
              </div>
              <div className="form-group">
                <CustomInput //Assuming you have this component
                  id="password"
                  label="Enter password"
                  variant="outlined"
                  fullWidth
                  type="password"
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
                    <span pl-4>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <p className="account-text">
                Don't have an account?{" "}
                <span className="btn" onClick={navigateToRegisterPage}>
                  Register
                </span>
                .<br />
                <br />
                <span className="btn" onClick={switchUserType}>
                  Switch to{" "}
                  {userType === UserType.CANDIDATE
                    ? UserType.RECRUITER
                    : UserType.CANDIDATE}{" "}
                  login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
