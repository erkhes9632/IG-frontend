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
  const userID = myUser?._id;

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
        `${process.env.backendUrl}/mypost/${myUser._id}`,
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
    <div className="min-h-screen flex flex-col  bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-6 pb-24 pt-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-center sm:items-start py-8 gap-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-200 transition-all hover:shadow-xl hover:bg-white/90">
          <img
            src={myUser?.profilePicture}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-400 shadow-md hover:scale-105 transition-transform duration-300"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {myUser?.username}
            </h2>
            <button className="mt-4 px-6 py-2 border border-indigo-500 text-indigo-600 font-semibold rounded-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white shadow-sm transition-all duration-300">
              Edit Profile
            </button>

            <div className="flex justify-center sm:justify-start gap-12 mt-6 text-gray-700 font-medium">
              <div className="text-center">
                <span className="font-bold text-indigo-700">
                  {posts.length}
                </span>
                <p className="text-sm">Posts</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-indigo-700">
                  {myUser?.followers.length}
                </span>
                <p className="text-sm">Followers</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-indigo-700">
                  {myUser?.following.length}
                </span>
                <p className="text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-indigo-400 select-none">
            <div className="flex justify-center mb-6">
              <Images className="w-16 h-16 text-indigo-300 animate-pulse" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-indigo-700">
              Share Photos
            </h3>
            <p className="mb-5 text-sm max-w-xs mx-auto text-gray-600">
              When you share photos, they will appear on your profile.
            </p>
            <button
              onClick={gopage2}
              className="inline-block px-6 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-md"
            >
              Share your first photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-8">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="aspect-square overflow-hidden rounded-xl relative cursor-pointer group shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                onClick={() => push(`/userPost/${userID}`)}
                title={post.caption}
              >
                <img
                  src={post.images[0]}
                  alt={`Post ${index}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg font-semibold">
                  {post.likes.length}
                </div>
              </div>
            ))}
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
