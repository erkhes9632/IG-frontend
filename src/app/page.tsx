"use client";

import { User, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Iconeins } from "@/icons/iconeins";
import {
  House,
  Search,
  SquarePlus,
  CircleUserRound,
  Heart,
  HeartCrack,
} from "lucide-react";
import { toast } from "sonner";

type PostType = {
  _id: string;
  caption: string;
  likes: string[];
  images: string[];
  user: User;
};

const Home = () => {
  const { myUser, token } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const ID = myUser?._id;

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

  const getPost = async () => {
    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
    getPost();
  }, [myUser, push]);

  const postLike = async (postId: string) => {
    const res = await fetch(`http://localhost:8080/toggle-like/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      await getPost();
    }
  };

  const followUser = async (followedUserId: string) => {
    const res = await fetch(
      `http://localhost:8080/follow-toggle/${followedUserId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      toast.success("success");
      await getPost();
    } else {
      toast.error("you failed");
      await getPost();
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 bg-gray-50 min-h-screen">
      <div className="pl-3 fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center shadow z-50">
        <Iconeins />
      </div>

      <div className="space-y-6 mt-16 mb-20">
        {posts.length === 0 && (
          <p className="text-center text-gray-500">No posts available</p>
        )}

        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition duration-300 ease-in-out hover:shadow-lg"
          >
            <div className="flex items-center relative gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-gray-800">
                {myUser?.username}
              </span>
              <div className="absolute top-2 right-2">
                {post.user.followers.includes(ID) ? (
                  <button
                    onClick={() => followUser(post.user._id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(post.user._id)}
                    className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>

            <div>
              <img
                src={post.images[0]}
                alt="Post"
                className="w-full object-cover  transition-transform duration-200 hover:scale-[1.01]"
              />
            </div>

            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => postLike(post._id)}
                  className="hover:scale-110 transition-transform duration-150"
                >
                  {post.likes.includes(ID!) ? (
                    <Heart color="red" fill="red" />
                  ) : (
                    <HeartCrack />
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  {post.likes.length} likes
                </span>
              </div>

              <p className="text-sm text-gray-800">
                <span className="font-semibold mr-1">{myUser?.username}</span>
                {post.caption}
              </p>
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

export default Home;
function getPost() {
  throw new Error("Function not implemented.");
}
