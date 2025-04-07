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