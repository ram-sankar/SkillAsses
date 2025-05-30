import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

interface Props {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedIn()) {
        navigate("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return <>{!loading && children}</>;
};

export default RequireAuth;
