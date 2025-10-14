"use client";
import { useRouter } from "next/navigation";
import {
  House,
  Images,
  Search,
  SquarePlus,
  CircleUserRound,
} from "lucide-react";
import { User, useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

type PostType = {
  _id: string;
  caption: string;
  likes: string[];
  images: string[];
  user: User;
};

const Page = () => {
  const { myUser, token } = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);

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

  const getMyPost = async () => {
    try {
      if (!myUser?._id) return;

      const response = await fetch(
        `http://localhost:8080/mypost/${myUser._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (!myUser) {
      push("/log-in");
      return;
    }
    getMyPost();
  }, [myUser, push]);
  return (
    <div>
      {" "}
      <div className="flex items-center py-5">
        <img
          src={myUser?.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-5"
        />
        <div>
          <h2 className="text-2xl font-semibold">{myUser?.username}</h2>
          <button className="mt-2 px-4 py-1 border border-gray-300 rounded hover:bg-gray-100">
            Edit Profile
          </button>
        </div>
      </div>
      <div className="flex justify-around border-t border-b border-gray-300 py-4 mb-6 text-center">
        <div>
          <div>0</div> posts
        </div>
        <div>
          <div>{myUser?.followers.length}</div> followers
        </div>
        <div>
          <div>{myUser?.following.length}</div> following
        </div>
      </div>
      <div className="space-y-6 mt-16 mb-20">
        {posts.length === 0 && (
          <div>
            <div className="max-w-md mx-auto font-sans p-4">
              <div className="text-center">
                <div className="flex justify-center">
                  <Images />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Photos</h3>
                <p className="mb-4">
                  When you share photos, they will appear on your profile.
                </p>
                <a href="#" className="text-blue-500 hover:underline">
                  Share your first photo
                </a>
              </div>
            </div>
          </div>
        )}

        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition duration-300 ease-in-out hover:shadow-lg"
          >
            <div>
              <img
                src={post.images[0]}
                alt="Post"
                className="w-full object-cover  transition-transform duration-200 hover:scale-[1.01]"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center shadow z-50">
        <House
          onClick={gopage3}
          className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-500 transition"
        />
        <Search
          onClick={gopage1}
          className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-500 transition"
        />
        <SquarePlus
          onClick={gopage2}
          className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-500 transition"
        />
        <CircleUserRound
          onClick={gopage4}
          className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-500 transition"
        />
      </div>
    </div>
  );
};
export default Page;
