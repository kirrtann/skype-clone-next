import apiHelper from "../apihelper";
import axiosInstance from "../axiosInstance";

export const Chat = async (userId: string) => {
  return apiHelper(axiosInstance.get(`contact/getContact/${userId}`));
};

export const Newcontact = async (credentials: {
  userId: string;
  contactId: string;
  name: string;
}) => {
  return apiHelper(axiosInstance.post(`contact/newContect`, credentials));
};

export const SearchUser = async (name: string) => {
  return apiHelper(axiosInstance.get(`user/allUsers/${name}`));
};

export const getmeassage = async (requestBody: {
  userId: string;
  otherUserId: string;
}) => {
  return apiHelper(axiosInstance.post("chat/history", requestBody));
};

export const getUserChatList = async (userId: string) => {
  return apiHelper(axiosInstance.get(`chat/getUserChatlist/${userId}`));
};
