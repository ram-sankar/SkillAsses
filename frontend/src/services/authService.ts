import { UserDetails, UserType } from "common/models/User";
import axiosInstance from "./axiosInstance";

const API_BASE = "/api/auth";

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  role: UserType,
): Promise<{ userId?: string; error?: string }> => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/register`, {
      email,
      password,
      username,
      role,
    });
    return { userId: response.data.userId };
  } catch (error: any) {
    return { error: error.response?.data?.error || "Registration failed" };
  }
};

export const loginUser = async (
  email: string,
  password: string,
  expectedUserType: UserType,
): Promise<{ uid?: string; idToken?: string; error?: string }> => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/login`, {
      email,
      password,
      expectedUserType,
    });
    const { idToken, uid, role, username, email: userEmail } = response?.data?.data;
    storeToken(idToken, uid, role, userEmail, username);

    return { uid, idToken };
  } catch (error: any) {
    return { error: error.response?.data?.error || "Login failed" };
  }
};

export const logoutUser = async () => {
  clearToken();
};

const storeToken = (
  token: string,
  uid: string,
  userType: UserType,
  email: string,
  username: string,
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("uid", uid);
  localStorage.setItem("userType", userType);
  localStorage.setItem("email", email);
  localStorage.setItem("username", username);
};

const clearToken = () => {
  localStorage.clear();
};

export const isLoggedIn = () => !!localStorage.getItem("token");

export const getUserDetails = (): UserDetails => {
  const token = localStorage.getItem("token");
  const uid = localStorage.getItem("uid");
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const userType = localStorage.getItem("userType") as UserType | undefined;

  return {
    token: token || "",
    uid: uid || "",
    email: email || "",
    username: username || "",
    userType: userType || UserType.CANDIDATE,
  };
};
