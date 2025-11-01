/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Comment = {
  comments: ReactNode;
  _id: string;
  comment: string;
  user: { username: string; profilePicture?: string };
};

export default function PostCommentsPage() {
  const { postId } = useParams();
  const { token } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter();

  const getComments = async () => {
    try {
      const response = await fetch(`backendUrl/get/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const createComment = async () => {
    const res = await fetch("backendUrl/create", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({ postId: postId, comments: newComment }),
    });

    if (res.ok) {
      setNewComment("");

      await getComments();

      toast.success("Comment added!");
    } else {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">💬 Comments</h2>
        <Button
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md px-3 py-1 transition"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {comments.length > 0 ? (
          comments.map((com) => (
            <div
              key={com._id}
              className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 font-bold flex items-center justify-center rounded-full uppercase">
                {com.user?.username?.[0] || "?"}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">
                  {com.user?.username || "Unknown User"}
                </div>
                <div className="text-gray-600">{com.comments}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        )}
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          onClick={() => {
            if (newComment.trim()) createComment();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
