import { TextField } from "@mui/material";
import Button from "components/Button";
import TopBar from "components/TopBar";
import { UserType } from "constants/models/User";
import "pages/styles/Login.scss"
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
    
}

export default function Login (props: Props) {
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

    const handleDeveloperLoginClick = () => {

    }

    const navigateToRegisterPage = () => {
        navigate(`/register?user=${userType}`)
    }

    const switchUserType = () => {
        const newUserType = userType === UserType.DEVELOPER ? UserType.RECRUITER : UserType.DEVELOPER
        setUserType(newUserType)
        navigate(`?user=${newUserType}`, { replace: true });
    }

    return (
        <>
            <TopBar />
            <div className="login-container">
                <div className="login-section">
                    <div className="login-section-content">
                        <h2>{userType} Login</h2>

                        <form className="login-form">
                            <div className="form-group">
                                <TextField id="filled-basic" label="Enter mail ID" variant="outlined" fullWidth />
                            </div>
                            <div className="form-group">
                                <TextField id="filled-basic" label="Enter password" variant="outlined" fullWidth />
                            </div>
                            <Button onClick={() => navigate("/login?user=recruiter")} size="xl">
                                Login
                            </Button>
                            <p className="account-text">
                                Don't have an account? <span className="btn" onClick={navigateToRegisterPage}>Register</span>.<br/><br/>
                                <span className="btn" onClick={switchUserType}>
                                    Switch to {userType === UserType.DEVELOPER ? UserType.RECRUITER : UserType.DEVELOPER} login
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}