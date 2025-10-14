"use client";
import { useRouter } from "next/navigation";
import {
  House,
  Search,
  SquarePlus,
  CircleUserRound,
  ChevronLeft,
} from "lucide-react";

const Page = () => {
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
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-white shadow-sm">
        <ChevronLeft
          onClick={gopage3}
          className="w-6 h-6 text-gray-800 cursor-pointer"
        />
        <input
          type="text"
          placeholder="Search"
          className="flex-grow mx-4 h-8 px-3 rounded-full bg-gray-100 text-sm focus:outline-none"
        />
      </div>

      <div className="flex-grow bg-gray-50 overflow-auto"></div>

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
