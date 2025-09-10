import apiHelper from "../apihelper";
import axiosInstance from "../axiosInstance";

export const SearchUser = async (name: string) => {
  return apiHelper(axiosInstance.get(`user/allUsers/${name}`));
};

export const getprofile = async () => {
  return apiHelper(axiosInstance.get("user/profile"));
};
