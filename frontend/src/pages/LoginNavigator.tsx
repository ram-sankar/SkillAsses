import Button from "components/Button";
import TopBar from "components/TopBar";
import { UserType } from "common/models/User";
import "pages/styles/Login.scss";
import { useNavigate } from "react-router-dom";

interface Props {}

export default function LoginNavigator(props: Props) {
  const navigate = useNavigate();

  const handleDeveloperLoginClick = () => {};

  return (
    <>
      <TopBar />
      <div className="login">
        <div className="container">
          <div className="login-section company">
            <div className="login-section-content">
              <h2>
                For <span className="highlight">Recruiters</span>
              </h2>
              <p>
                Efficiently manage assignments, test questions, and track
                candidates' interview stages with ease.
              </p>
              <Button
                onClick={() => navigate(`/login?user=${UserType.RECRUITER}`)}
              >
                Login
              </Button>
              <p className="account-text">
                Don't have an account?
                <br />
                <span className="btn">Sign up</span>.
              </p>
            </div>
          </div>
          <div className="login-section developer">
            <div className="login-section-content">
              <h2>
                For <span className="highlight">Developers</span>
              </h2>
              <p>
                Streamline your job application process by managing and tracking
                your assignments efficiently.{" "}
              </p>
              <Button
                outline
                onClick={() => navigate(`/login?user=${UserType.RECRUITER}`)}
              >
                Login
              </Button>
              <p className="account-text">
                Don't have an account?
                <br />
                <span className="btn">Sign up</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
