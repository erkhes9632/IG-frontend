"use client";

import { User, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Iconeins } from "@/icons/iconeins";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  House,
  Search,
  SquarePlus,
  CircleUserRound,
  Heart,
  HeartCrack,
  MessageCircle,
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
  const ID = myUser?._id as string;

  const gopage2 = () => push("/Create");
  const gopage3 = () => push("/");
  const gopage4 = () => push("/profile");
  const gopage1 = () => push("/search");

  const getPost = async () => {
    try {
      const response = await fetch(`${process.env.backendUrl}/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
      push("/Log-in");
      return;
    }
    getPost();
  }, [myUser, push]);

  const postLike = async (postId: string) => {
    const res = await fetch(`${process.env.backendUrl}/toggle-like/${postId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) await getPost();
  };

  const followUser = async (followedUserId: string) => {
    const res = await fetch(
      `${process.env.backendUrl}/follow-toggle/${followedUserId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      toast.success("Success");
      await getPost();
    } else {
      toast.error("Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 bg-gray-50 min-h-screen">
      <div className="pl-3 fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center gap-x-6 shadow z-50">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse">
          WELCOME TO
        </h1>
        <span className="text-3xl text-yellow-500">
          <Iconeins />
        </span>
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
              {post.user.profilePicture ? (
                <img
                  src={post.user.profilePicture}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-lg">
                  {post.user.username?.[0].toUpperCase()}
                </div>
              )}

              <span
                onClick={() => push(`/users/${post.user._id}`)}
                className="text-sm font-medium text-gray-800 cursor-pointer hover:underline"
              >
                {post.user.username}
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

            <div className="relative">
              <Carousel className="w-full max-w-3xl mx-auto relative  overflow-hidden shadow-lg">
                <CarouselContent>
                  {post.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <img
                        src={img}
                        alt={`Post image ${i + 1}`}
                        className="w-full  "
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {post.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1" />
                  </>
                )}
              </Carousel>
            </div>

            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => postLike(post._id)}
                  className="hover:scale-110 transition-transform duration-150"
                >
                  {post.likes.includes(ID) ? (
                    <Heart color="red" fill="red" />
                  ) : (
                    <HeartCrack />
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  {post.likes.length} likes
                </span>
                <div
                  onClick={() => push(`/comments/${post._id}`)}
                  className="cursor-pointer"
                >
                  <MessageCircle />
                </div>
              </div>

              <p className="text-sm text-gray-800">
                <span className="font-semibold mr-1">{post.user.username}</span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}
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

export default Home;
