import { TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Button from "components/Button";
import CustomInput from "components/Form/CustomInput";
import ErrorMessage from "components/Form/ErrorMessage";
import TopBar from "components/TopBar";
import { UserType } from "constants/models/User";
import { useFormik } from "formik";
import "pages/styles/Login.scss"
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from 'yup';

interface Props {
    
}

export default function Register (props: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState<UserType>(UserType.DEVELOPER);
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const user = queryParams.get('user');

        if (user === UserType.RECRUITER) {
            setUserType(UserType.RECRUITER)
        }
    }, [])

    const handleFormSubmit = (values: FormElements) => {
        console.log(values)
    }

    const navigateToLoginPage = () => {
        navigate(`/login?user=${userType}`)
    }

    const switchUserType = () => {
        const newUserType = userType === UserType.DEVELOPER ? UserType.RECRUITER : UserType.DEVELOPER
        setUserType(newUserType)
        navigate(`?user=${newUserType}`, { replace: true });
    }

    const formik = useFormik<FormElements>({
        initialValues: {
          username: '',
          password: '',
          email: '',
        },
        validationSchema: Yup.object({
          username: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          password: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
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

                        <form className="login-form" onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <CustomInput
                                    id="username" 
                                    label="Username" 
                                    fullWidth 
                                    {...formik.getFieldProps('username')} 
                                    errorMessage={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                                />
                            </div>
                            <div className="form-group">
                                <CustomInput
                                    id="password" 
                                    label="Password" 
                                    fullWidth 
                                    {...formik.getFieldProps('password')} 
                                    errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                                />
                            </div>
                            <div className="form-group">
                                <CustomInput
                                    id="email" 
                                    label="Mail Id" 
                                    fullWidth 
                                    {...formik.getFieldProps('email')} 
                                    errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                                />
                            </div>
                            <Button type="submit" size="xl">
                                Register
                            </Button>
                            <p className="account-text">
                                Have an account? <span className="btn" onClick={navigateToLoginPage}>Login</span>.<br/><br/>
                                <span className="btn" onClick={switchUserType}>
                                    Register as {userType === UserType.DEVELOPER ? UserType.RECRUITER : UserType.DEVELOPER}
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

interface FormElements { 
    username: string; 
    password: string; 
    email: string; 
}