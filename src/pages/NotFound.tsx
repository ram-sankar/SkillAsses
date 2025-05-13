import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "pages/styles/NotFound.scss";

const NotFound = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <div className="not-found">
             <div className="stars"></div>
            <div className="container">
                <div className="content">
                    <h1>4<span className="zero">0</span>4</h1>
                    <h2>Lost in Space</h2>
                    <p>The page you're looking for has drifted into a black hole.</p>
                    <Button onClick={handleClick} size="xl">
                        Return to Earth
                    </Button>
                </div>
            </div>
    </div>
    );
};

export default NotFound;
