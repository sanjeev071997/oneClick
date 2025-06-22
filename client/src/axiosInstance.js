import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://oneclick-te0x.onrender.com",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
}); 

export default instance; 