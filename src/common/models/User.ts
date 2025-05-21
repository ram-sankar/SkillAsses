export enum UserType {
  RECRUITER = "Recruiter",
  CANDIDATE = "Candidate",
}

export interface UserDetails {
  token: string;
  uid: string;
  email: string;
  userType: UserType;
}
