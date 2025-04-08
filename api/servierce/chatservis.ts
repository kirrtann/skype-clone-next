import apiHelper from "../apihelper";
import axiosInstance from "../axiosInstance";

export const Chat = async (userId: string) => {
  return apiHelper(axiosInstance.get(`contact/getContact/${userId}`));
};

export const Newcontact = async (credentials :{userId: string, contactId: string,name:string}) => {
  return apiHelper(
    axiosInstance.post(`contact/newContect/${credentials} ` )
  );

};

export const SearchUser  = async (name:string)=>{
  return apiHelper(axiosInstance.get(`contact/allUsers/${name}`));
}

export const MessageHistory = async (roomId: string) => {
  return apiHelper(axiosInstance.post(`chat/GetChatHistory/${roomId}`));
}


export const getmeassage = async (requestBody: { userId: string, otherUserEmail: string }) => {
  return apiHelper(axiosInstance.post('chat/getchat', requestBody));
}