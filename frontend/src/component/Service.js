import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    authorization: `Bearer ${ localStorage.getItem("Token")}`
  }
});

// User API
export const userAPI = 
{
  register: (userData) => axiosInstance.post("/register", userData),
  login: (user) => axiosInstance.post("/login", user),
  logout: () => axiosInstance.post("/logout"),
  forgotPassword: (email) => axiosInstance.post(`/forgot-password?email=${email}`),
  setNewPassword: (setNewPasswordData, token) =>  axiosInstance.post("/set-password", setNewPasswordData, { headers: { authorization: `Bearer ${token}` }}),
  updateProfile: (file) => axiosInstance.post("/update-profile", file, { headers: {"Content-Type": "multipart/form-data" }})
};

// Notes API
export const notesAPI = 
{
  create: (body) => axiosInstance.post("/note", body),
  get: () => axiosInstance.get("/note"),
  delete: (noteId) => axiosInstance.delete(`/note/${noteId}`),
  update: (body,noteId) => axiosInstance.put(`/note/${noteId}`,body),
  search: (searchData) => axiosInstance.get(`/note/${searchData}`),
  collaborator: (collaborator, noteId, add) => axiosInstance.put(`/note/collaborator/${noteId}?collaborator=${collaborator}&add=${add}`),
};

// Labels API
export const labelsAPI = 
{
  create: (body) => axiosInstance.post("/label", body),
  delete: (labelId) => axiosInstance.delete(`/label/${labelId}`),
  edit: (body, labelId) => axiosInstance.put(`/label/${labelId}`, body),
  get: () => axiosInstance.get("/label"),
};

// Label with Note API
export const labelWithNoteAPI = 
{
  add: (body) => axiosInstance.post("/label-with-note", body),
  update: (labelId, noteId, addToSet) => axiosInstance.put(`/label-With-note/${labelId}?noteId=${noteId}&addToSet=${addToSet}`),
  get: (labelId) => axiosInstance.get(`/label-with-note/${labelId}`)

};