import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "./axiosConfig";
import { setCookie, parseCookies } from "nookies";
import { useHistory } from "react-router-dom";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const isAuthenticated = !!user;

  const signIn = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { token, user } = response.data;

      setCookie(undefined, "finder-token", token, {
        maxAge: 60 * 60 * 1,
      });

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
