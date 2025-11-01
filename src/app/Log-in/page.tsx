"use client";

import { decodeTokenType, useUser } from "@/providers/AuthProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconeIG } from "@/icons/iconeIG";
import { jwtDecode } from "jwt-decode";

type InputType = {
  email: string;
  password: string;
};

const Page = () => {
  const { push } = useRouter();
  const { myUser, setMyUser, setToken } = useUser();
  const [inputVal, setInputVal] = useState<InputType>({
    email: "",
    password: "",
  });

  const LOGDOLT = async (item: InputType) => {
    const response = await fetch(`${process.env.backendUrl}/log-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: item.email,
        password: item.password,
      }),
    });

    if (!response.ok) {
      toast.error("ERROR: PASSWORD OR EMAIL IS INCORRECT !!");
    } else {
      const user = await response.json();
      const decodedtoken: decodeTokenType = jwtDecode(user);
      localStorage.setItem("token", user);
      toast.success("Succsesfuly log in...");
      setToken(user);
      setMyUser(decodedtoken.data);
      push("/");
    }
  };

  const goToSignUpPage = () => {
    push("/sign-up");
  };

  const handlValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInputVal({ ...inputVal, email: value });
    }
    if (name === "password") {
      setInputVal({ ...inputVal, password: value });
    }
  };

  useEffect(() => {
    if (myUser) push("/");
  }, [myUser]);

  return (
    <div className="flex justify-center">
      <div className="border-1 bg-gray-100 w-[430px] h-[932px]">
        <div className="flex justify-center mt-50">
          <IconeIG />
        </div>

        <div className=" mt-[100px] mb-[200px] ml-[80px] mr-[80px]">
          <div>
            <Input
              placeholder="email"
              type="email"
              name="email"
              value={inputVal.email}
              onChange={(e) => handlValue(e)}
            />
            <Input
              className="mt-3"
              placeholder="password"
              type="password"
              name="password"
              value={inputVal.password}
              onChange={(e) => handlValue(e)}
            />
            <Button
              className="w-[270px] mt-5 bg-blue-500"
              onClick={() => LOGDOLT(inputVal)}
            >
              Log in
            </Button>
          </div>
          <div className="flex mt-5 justify-center">
            <div>OR</div>
          </div>
          <div className="flex mt-8 place-content-around">
            <div>Do not have an account? </div>
            <button
              onClick={goToSignUpPage}
              className=" text-blue-500 font-bold "
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
