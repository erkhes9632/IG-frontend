"use client";
import { useRouter } from "next/navigation";
import {
  House,
  Search,
  SquarePlus,
  CircleUserRound,
  ChevronLeft,
} from "lucide-react";
import { User, useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

const Page = () => {
  const { push } = useRouter();
  const { token } = useUser();
  const [searchVal, setSearchVal] = useState<string>();
  const [user, setUser] = useState<User[]>([]);

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

  const getUser = async () => {
    const response = await fetch(`backendUrl/users/${searchVal}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const users = await response.json();
    setUser(users);
  };

  useEffect(() => {
    if (!token) return;

    if (searchVal && searchVal.trim() !== "") {
      getUser();
    } else {
      setUser([]);
    }
  }, [searchVal, token]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md sticky top-0 z-50 rounded-b-2xl">
        <ChevronLeft
          onClick={gopage3}
          className="w-6 h-6 cursor-pointer hover:text-yellow-300 transition-transform hover:-translate-x-1"
        />
        <div className="relative flex-grow mx-4">
          <input
            type="text"
            placeholder="Search users..."
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 pl-4 pr-10 rounded-full bg-white/20 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white/30 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex-grow overflow-auto p-4 bg-gradient-to-b from-indigo-100 via-blue-50 to-purple-100 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100">
        {user.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 animate-fadeIn">
            {user.map((u) => (
              <div
                key={u._id}
                onClick={() => push(`/users/${u._id}`)}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-sm hover:shadow-xl hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={u.profilePicture || "https://via.placeholder.com/40"}
                  alt={u.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-md hover:scale-105 transition-transform"
                />
                <div>
                  <p className="font-semibold text-indigo-700">{u.username}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-indigo-400 animate-fadeIn">
            <Search className="w-12 h-12 mb-2 opacity-60" />
            <p className="text-sm">Please search for users</p>
          </div>
        )}
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
