import apiHelper from "../apihelper";
import axiosInstance from "../axiosInstance";

export const signup  = async(credentials:{email:string, password:string,birth_date:Date,name:string}) => {
  return apiHelper(axiosInstance.post('/auth/signup', credentials));
}

export const login = async(credentials:{email:string, password:string}) => {  
  return apiHelper(axiosInstance.post('/auth/login', credentials));
}