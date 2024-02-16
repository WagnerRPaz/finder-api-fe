import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token } = parseCookies();

const instance = axios.create({
  baseURL: "http://localhost:8081",
});

if (token) {
  instance.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default instance;
