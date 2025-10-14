"use client";

import { decodeTokenType, useUser } from "@/providers/AuthProvider";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconeIG } from "@/icons/iconeIG";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type InputType = {
  email: string;
  password: string;
  username: string;
};

const Page = () => {
  const { push } = useRouter();
  const { setMyUser, setToken } = useUser();

  const [inputVal, setInputVal] = useState<InputType>({
    email: "",
    password: "",
    username: "",
  });

  const LOGDOLT = async (item: InputType) => {
    const response = await fetch("http://localhost:8080/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: item.email,
        password: item.password,
        username: item.username,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      const decodedtoken: decodeTokenType = jwtDecode(user);
      localStorage.setItem("token", user);
      toast.success("Succsesfuly sign up...");
      setToken(user);
      setMyUser(decodedtoken.data);
      push("/");
    } else {
      toast.error("User or Email already exists !!!");
    }
  };

  const handlValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInputVal({ ...inputVal, email: value });
    }
    if (name === "password") {
      setInputVal({ ...inputVal, password: value });
    }
    if (name === "username") {
      setInputVal({ ...inputVal, username: value });
    }
  };

  const goToLogInPage = () => {
    push("/log-in");
  };
  return (
    <div className="flex justify-center">
      <div className="border-1 bg-gray-100 w-[430px] h-[932px]">
        <div className="flex justify-center mt-50">
          <IconeIG />
        </div>
        <div className="w-65 mt-5 ml-20 text-center">
          Sign up to see photos and videos from your friends
        </div>
        <div className=" mt-[30px] mb-[200px] ml-[80px] mr-[80px]">
          <div>
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={inputVal.email}
              onChange={(e) => handlValue(e)}
            />
            <Input
              className="mt-3"
              placeholder="User name"
              type="email"
              name="username"
              value={inputVal.username}
              onChange={(e) => handlValue(e)}
            />
            <Input
              className="mt-3"
              placeholder="Password"
              type="password"
              name="password"
              value={inputVal.password}
              onChange={(e) => handlValue(e)}
            />
            <Button
              className="w-[270px] mt-5 bg-blue-500"
              onClick={() => LOGDOLT(inputVal)}
            >
              Sign up
            </Button>
          </div>
          <div className="flex mt-5 justify-center">
            <div>OR</div>
          </div>
          <div className="flex mt-8 place-content-around">
            <div>Have an account? </div>
            <button
              onClick={goToLogInPage}
              className=" text-blue-500 font-bold "
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
