import { List } from "@mui/icons-material";
import { Box, ListItem, ListItemButton, ListItemText } from "@mui/material";
import "components/styles/TopBar.scss";
import { UserType } from "common/models/User";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails, isLoggedIn, logoutUser } from "services/authService";
import Button from "./Button";

interface Props {}

export default function TopBar(props: Props) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    const userDetails = getUserDetails();
    setUserType(userDetails.userType);
  }, []);

  const renderNavigation = () => {
    if (userType === UserType.RECRUITER) {
      return (
        <ul className="nav-links">
          <ListItemButton component="a" href="/recruiter/assigned-test">
            <ListItemText>Assigned Tests</ListItemText>
          </ListItemButton>
          <ListItemButton component="a" href="/recruiter/test-library">
            <ListItemText>Test Library</ListItemText>
          </ListItemButton>
          <ListItemButton component="a" href="/recruiter/candidates">
            <ListItemText>Candidates</ListItemText>
          </ListItemButton>
        </ul>
      );
    } else if (userType === UserType.CANDIDATE) {
      return (
        <ul className="nav-links">
          <ListItemButton component="a" href="/candidate/assignments">
            <ListItemText>Assignment List</ListItemText>
          </ListItemButton>
        </ul>
      );
    }
    return null;
  };

  const handleOnSignUpClick = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const renderSignUp = () => (
    <Button onClick={handleOnSignUpClick} size={"md"} outline>
      Sign up
    </Button>
  );

  const renderLogout = () => (
    <Button onClick={handleLogout} size={"md"} outline>
      Logout
    </Button>
  );

  return (
    <nav className="navbar">
      <div className="logo">SkillAssess ({userType})</div>
      <Box>{renderNavigation()}</Box>
      {isLoggedIn() ? renderLogout() : renderSignUp()}
    </nav>
  );
}
