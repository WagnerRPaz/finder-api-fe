import axios from "axios";
import { parseCookies } from "nookies";

const { "finder-token": token } = parseCookies();

const instance = axios.create({
  baseURL: "http://localhost:8081",
});

instance.interceptors.request.use((config) => {
  return config;
});

if (token) {
  instance.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default instance;