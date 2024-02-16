import React, { createContext, useEffect, useState, useContext } from "react";
import axiosInstance from "./axiosConfig";
import { setCookie, parseCookies } from "nookies";
import { useHistory } from "react-router-dom";
import instance from "./axiosConfig";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const isAuthenticated = !!user;

  useEffect(() => {
    async function fetchData() {
      const { "finder-token": token } = parseCookies();
      if (token) {
        try {
          const response = await axiosInstance.get("/auth/userInfo");
          setUser(response.data);
        } catch (error) {
          console.error("Erro ao buscar informações do usuário:", error);
        }
      }
    }

    fetchData();
  }, []);

  const signIn = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { token, user } = response.data;

      setCookie(undefined, "finder-token", token, {
        maxAge: 60 * 60 * 1,
      });

      instance.defaults.headers["Authorization"] = `Bearer ${token}`;

      setUser(user);
      history.push("/home");
    } catch (error) {
      console.error("Erro durante o login:", error);
      setError("Erro durante o login. Por favor, verifique suas credenciais.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
