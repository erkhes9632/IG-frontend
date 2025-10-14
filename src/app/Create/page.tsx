"use client";
import { Button } from "@/components/ui/button";
import { IconePIC } from "@/icons/iconePIC";
import { IconeX } from "@/icons/iconeX";
import { useRouter } from "next/navigation";
import { House, Search, SquarePlus, CircleUserRound } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const { push } = useRouter();
  const gopage2 = () => {
    push("/create");
  };
  const gopage3 = () => {
    push("/");
  };
  const gopage4 = () => {
    push("/profile");
  };
  const gopage1 = () => {
    push("/search");
  };

  const gopage = () => {
    router.push("/imgCreate");
  };

  return (
    <div className="p-2 max-w-md mx-auto relative bg-white rounded-xl ">
      <button
        onClick={gopage3}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
      >
        <IconeX />
      </button>

      <div className="text-center text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mt-4">
        New Photo Post
      </div>

      <div className="flex flex-col items-center justify-center mt-20 space-y-6">
        <div className="p-4 rounded-full">
          <IconePIC />
        </div>

        <Button className="bg-blue-500 hover:bg-blue-600 text-white w-[160px] py-2 rounded-md text-sm">
          Photo Library
        </Button>

        <button
          onClick={gopage}
          className="text-blue-500 text-sm font-medium hover:underline"
        >
          Generate with AI
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-300 flex justify-around items-center shadow-md z-50">
        <House
          onClick={gopage3}
          className="w-7 h-7 text-gray-800 cursor-pointer hover:text-blue-500"
        />
        <Search
          onClick={gopage1}
          className="w-7 h-7 text-gray-800 cursor-pointer hover:text-blue-500"
        />
        <SquarePlus
          onClick={gopage2}
          className="w-7 h-7 text-gray-800 cursor-pointer hover:text-blue-500"
        />
        <CircleUserRound
          onClick={gopage4}
          className="w-7 h-7 text-gray-800 cursor-pointer hover:text-blue-500"
        />
      </div>
    </div>
  );
};

export default Page;
