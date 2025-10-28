"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { House, Search, SquarePlus, CircleUserRound } from "lucide-react";
import { toast } from "sonner";

type Post = {
  _id: string;
  images: string[];
  caption: string;
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
  const { push } = useRouter();
  const { token, myUser } = useUser();
  const params = useParams();

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = params.id as string;

  const goTo = (path: string) => push(path);

  const fetchUserInfo = async () => {
    const res = await fetch(`http://localhost:8080/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfileUser(data);
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`http://localhost:8080/userpost/${userId}`, {
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

  const followUser = async () => {
    if (!profileUser) return;
    const res = await fetch(
      `http://localhost:8080/follow-toggle/${profileUser._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      toast.success("Action successful!");
      fetchUserInfo();
    } else {
      toast.error("Failed to follow/unfollow user");
    }
  };

  const isFollowing =
    profileUser?.followers?.includes(myUser?._id ?? "") ?? false;

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24">
      <div className="flex flex-col sm:flex-row items-center sm:items-start py-8 gap-6 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
        {profileUser?.profilePicture ? (
          <img
            src={profileUser.profilePicture}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-400 transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-300 ring-4 ring-gray-200" />
        )}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-wide text-gray-900">
            {profileUser?.username}
          </h2>
          {profileUser?.bio && (
            <p className="mt-2 text-gray-600 text-sm max-w-sm mx-auto sm:mx-0">
              {profileUser.bio}
            </p>
          )}

          <div>
            {profileUser && myUser?._id !== profileUser._id && (
              <button
                onClick={followUser}
                className={`mt-4 px-5 py-1.5 rounded-full font-medium text-sm transition-all duration-200 shadow-sm
              ${
                isFollowing
                  ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-300"
              }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <div className="flex justify-center sm:justify-start gap-12 mt-6 text-sm sm:text-base text-gray-700 font-medium">
            <div>
              <span className="font-bold text-gray-900">{posts.length}</span>{" "}
              posts
            </div>
            <div>
              <span className="font-bold text-gray-900">
                {profileUser?.followers?.length ?? 0}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-bold text-gray-900">
                {profileUser?.following?.length ?? 0}
              </span>{" "}
              following
            </div>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400 select-none">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-300 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-700">
            No Posts Yet
          </h3>
          <p className="mb-5 text-sm max-w-xs mx-auto">
            When this user shares photos, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mt-8">
          {posts.map((post, index) =>
            post.images.map((img, idx) => (
              <div
                onClick={() => push(`/userPost/${profileUser?._id}`)}
                key={`${post._id}-${idx}`}
                className="aspect-square overflow-hidden rounded-lg relative cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={img}
                  alt={`Post ${index}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))
          )}
        </div>
      )}

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
          onClick={() => goTo("/create")}
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
