"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
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
import { Iconeins } from "@/icons/iconeins";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Post = {
  _id: string;
  images: string[];
  caption: string;
  likes: string;
};

type ProfileUser = {
  _id: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
};

export default function OtherUserProfilePage() {
  const { token, myUser } = useUser();
  const params = useParams();
  const { push } = useRouter();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = params.userID as string;
  const ID = myUser?._id as string;

  const goTo = (path: string) => push(path);

  const fetchUserInfo = async () => {
    const res = await fetch(`${process.env.backendUrl}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfileUser(data);
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`${process.env.backendUrl}/userpost/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserInfo();
      fetchUserPosts();
    }
  }, [userId, token]);

  const postLike = async (postId: string) => {
    const res = await fetch(`${process.env.backendUrl}/toggle-like/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      await fetchUserPosts();
    }
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
      toast.success("success");
      await fetchUserPosts(), fetchUserInfo;
    } else {
      toast.error("you failed");
      await fetchUserPosts(), fetchUserInfo;
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
              <div className="w-10 h-10 rounded-full bg-gray-300">
                <img
                  className="w-10 h-10 rounded-full bg-gray-300"
                  src={profileUser?.profilePicture}
                />
              </div>

              <span className="text-sm font-medium text-gray-800">
                {profileUser?.username}
              </span>
              <div className="absolute top-2 right-2">
                {profileUser?.followers?.includes(ID) ? (
                  <button
                    onClick={() => followUser(profileUser._id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(profileUser!._id)}
                    className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>

            <Carousel className="w-full max-w-3xl mx-auto relative rounded-xl overflow-hidden shadow-lg">
              <CarouselContent>
                {post.images.map((postImage, index) => (
                  <CarouselItem
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <img
                      src={postImage}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

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
                <div
                  onClick={() => {
                    push(`/comments/${post._id}`);
                  }}
                >
                  <MessageCircle />
                </div>
              </div>

              <p className="text-sm text-gray-800">
                <span className="font-semibold mr-1">
                  {profileUser?.username}
                </span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 border-t border-indigo-300 flex justify-around items-center shadow-lg z-50 text-white">
        <House
          onClick={() => goTo("/")}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <Search
          onClick={() => goTo("/search")}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <SquarePlus
          onClick={() => goTo("/Create")}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
        <CircleUserRound
          onClick={() => goTo("/profile")}
          className="w-7 h-7 cursor-pointer hover:text-yellow-300 hover:scale-110 transition-transform duration-200"
        />
      </nav>
    </div>
  );
}
