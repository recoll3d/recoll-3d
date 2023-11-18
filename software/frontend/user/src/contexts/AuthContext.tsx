import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { api } from "../services/api";

type AuthProviderType = {
  children: any;
};

type SignUpData = {
  name: string;
  username: string;
  email: string;
  password: string;
  profile_id: string;
};

type SignInData = {
  email: string;
  username: string;
  password: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  profile: {
    id: string;
    name: string;
    image_url: string;
  };
  level: {
    id: string;
    name: string;
    position: number;
  };
  created_at: Date;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderType) {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = Cookies.get("reactauth.token");

    if (token) {
      api
        .get(`/users/${token}`, {
          // params: token,
          headers: {
            Authorization: `Barear ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          // console.log(response.data);
        });
    }
  }, []);

  async function signIn({ email, username, password }: SignInData) {
    try {
      const { data } = await api.post("/authenticate", {
        email,
        username,
        password,
      });

      Cookies.set("reactauth.token", String(data.token), {
        expires: 1,
      });

      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      api
        .get(`/users/${data.token}`, {
          // params: token,
          headers: {
            Authorization: `Barear ${data.token}`,
          },
        })
        .then((response) => {
          setUser(response.data);

          navigate("/dashboard", {
            state: {
              user: response.data,
            },
          });
        });
    } catch (err) {
      window.alert("Ops!!! Algo deu errado. \nTente novamente mais tarde.");
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
