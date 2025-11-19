import axios from "axios";

const api = axios.create({
  baseURL: "https://skillmate-backend-5g3j.onrender.com", 
});

export default api;
