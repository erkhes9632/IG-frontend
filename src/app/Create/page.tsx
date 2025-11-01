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
    push("/Create");
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
    router.push("/ImgCreate");
  };

  return (
    <div className="p-2 max-w-md mx-auto relative bg-white rounded-xl ">
      <button
        onClick={gopage3}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition"
      >
        <IconeX />
      </button>

      <div className="text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-b border-indigo-200 pb-3 mt-4">
        New Photo Post
      </div>

      <div className="flex flex-col items-center justify-center mt-20 space-y-6">
        <div className="p-4 rounded-full">
          <IconePIC />
        </div>

        <Button
          onClick={() => router.push("/picUploud")}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white w-[160px] py-2 rounded-md text-sm shadow-md transition-all"
        >
          Photo Library
        </Button>

        <button
          onClick={gopage}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium hover:underline"
        >
          Generate with AI
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 border-t border-indigo-300 flex justify-around items-center shadow-lg z-50 text-white">
        <House
          onClick={gopage3}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <Search
          onClick={gopage1}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <SquarePlus
          onClick={gopage2}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <CircleUserRound
          onClick={gopage4}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
      </div>
    </div>
  );
};

export default Page;
