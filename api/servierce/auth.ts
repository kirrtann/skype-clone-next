import apiHelper from "../apihelper";
import axiosInstance from "../axiosInstance";

export const signup = async (credentials: {
  email: string;
  password: string;
  birth_date: Date;
  name: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/signup", credentials));
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/login", credentials));
};

// export const login = async (credentials: {
//   email: string;
//   password: string;
// }) => {
//   try {
//     const response = axios.post("/auth/login", credentials);
//     return await response;
//   } catch (err: unknown) {
//     console.error("login error", err);
//     return undefined;
//   }
// };
export const otpvaarify = async (credentials: {
  email: string | null;
  otp: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/verify-otp", credentials));
};

export const forgotPassword = async (email: string) => {
  return apiHelper(axiosInstance.post("/auth/forgot-password", { email }));
};

export const verifyForgotPasswordOtp = async (credentials: {
  email: string;
  otp: string;
}) => {
  return apiHelper(
    axiosInstance.post("/auth/verify-forgot-password-otp", credentials)
  );
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  return apiHelper(axiosInstance.post("/auth/reset-password", data));
};
