"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type User = {
  followers: any;
  following: any;
  _id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string;
};
type createContextType = {
  myUser: User | null;
  setMyUser: Dispatch<SetStateAction<null | User>>;
  setToken: Dispatch<SetStateAction<null | string>>;
  token: string | null;
};

export type decodeTokenType = {
  data: User;
};

export const AuthCountext = createContext<createContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [myUser, setMyUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { push } = useRouter();
  useEffect(() => {
    const loctoken = localStorage.getItem("token");

    if (typeof window !== "undefined") {
      if (loctoken) {
        const decodedtoken: decodeTokenType = jwtDecode(loctoken);
        setMyUser(decodedtoken.data);
        setToken(loctoken);
      }
    } else {
      push("/login");
    }
  }, []);

  const values = {
    myUser,
    setMyUser,
    token,
    setToken,
  };
  return (
    <AuthCountext.Provider value={values}>{children}</AuthCountext.Provider>
  );
};

export const useUser = () => {
  const authContext = useContext(AuthCountext);

  if (!authContext) {
    throw new Error("providert hiigeechee");
  }

  return authContext;
};
