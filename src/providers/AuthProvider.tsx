"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string;
};

type createContextType = {
  myUser: User | null;
  setMyUser: Dispatch<SetStateAction<null | User>>;
};

export const AuthCountext = createContext<createContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [myUser, setMyUser] = useState<User | null>(null);

  useEffect(() => {
    const userItem = localStorage.getItem("user");

    if (userItem) {
      setMyUser(JSON.parse(userItem));
    }
  }, []);

  const values = {
    myUser,
    setMyUser,
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
