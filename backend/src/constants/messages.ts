export const COMMON_STRINGS = {
  SUCCESS: "Success",
  MISSING_USER_EMAIL: "Unauthorized: Missing user email",
  MISSING_USER_TYPE: "Missing userType query parameter",
  INVALID_USER_TYPE: "Invalid userType",
  MISSING_ASSIGNMENT_ID: "Missing assignmentId",
  ASSIGNMENT_NOT_FOUND: "Assignment not found",
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  LOGOUT_MESSAGE: "Logout handled client-side by clearing tokens",
  MISSING_AUTHORIZATION_HEADER: "Missing or invalid authorization header",
  USER_NOT_FOUND: "User not found",
};

export const ASSIGNMENT_MESSAGES = {
  ASSIGNMENT_CREATED: "Assignment created",
  FAILED_CREATE_ASSIGNMENT: "Failed to create assignment",
  FAILED_FETCH_ASSIGNMENT: "Failed to fetch assignment",
  FAILED_SAVE_ANSWER: "Failed to save answer and score",
};

export const AUTH_MESSAGES = {
  REGISTRATION_FAILED: "Registration failed",
  USER_REGISTERED: "User registered successfully",
  LOGIN_FAILED: "Login failed",
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  INVALID_ROLE: "Invalid role. Expected {expectedUserType}, found {actualUserType}",
  USER_DETAILS_FETCHED: "User details fetched successfully",
  USER_DATA_NOT_FOUND: "User data not found",
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  INVALID_TOKEN: "Invalid token",
};
