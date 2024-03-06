import React, { createContext, useEffect, useState, useContext } from "react";
import axiosInstance from "../services/axiosConfig";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useHistory } from "react-router-dom";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const isAuthenticated = !!user;

  const fetchData = async () => {
    const { "finder-token": token } = parseCookies();
    if (token) {
      try {
        const response = await axiosInstance.get("/auth/userInfo");
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, [history]);

  const signIn = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { token, user } = response.data;

      setCookie(undefined, "finder-token", token, {
        maxAge: 60 * 60 * 1,
      });

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      console.error("Erro durante o login:", error);
      throw error;
    }
  };

  const signOut = () => {
    destroyCookie(undefined, "finder-token");
    setUser(null);
    history.push("/home");
  };

  const signUp = async (data) => {
    try {
      await axiosInstance.post("/auth/register", data);
      setTimeout(() => {
        history.push("/login");
      }, 500);
    } catch (error) {
      console.error("Erro durante o registro:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp, fetchData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
