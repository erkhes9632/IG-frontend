"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconeX } from "@/icons/iconeX";
import { useUser } from "@/providers/AuthProvider";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { push } = useRouter();
  const { myUser, token } = useUser();

  const [captionVal, setCaptionVal] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setFiles(selectedFiles);
  };

  const uploadFiles = async () => {
    if (!files.length) {
      toast.error("Please select at least one image!");
      return;
    }

    setLoading(true);
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        )
      );

      const urls = uploaded.map((u) => u.url);
      setUploadedUrls(urls);
      toast.success("All images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const posting = async () => {
    if (!uploadedUrls.length) {
      toast.error("Please upload images first!");
      return;
    }

    const response = await fetch(`${process.env.backendUrl}/posting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: myUser?._id,
        images: uploadedUrls,
        caption: captionVal,
      }),
    });

    if (response.ok) {
      toast.success("Successfully created post!");
      push("/");
    } else {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="p-5 w-full max-w-md mx-auto relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100">
        <div className="flex items-center justify-center border-b border-indigo-100 pb-3 relative">
          <button
            onClick={() => push("/create")}
            className="absolute left-4 p-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <div className="w-5 h-5">
              <IconeX />
            </div>
          </button>
          <div className="text-center text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
            New Photo Post
          </div>
        </div>

        <div className="mt-6">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="w-full border border-indigo-200 p-3 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition"
          />
        </div>

        <Button
          onClick={uploadFiles}
          disabled={loading}
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </Button>

        <div className="mt-6">
          <Input
            placeholder="Write your caption..."
            onChange={(e) => setCaptionVal(e.target.value)}
            value={captionVal}
            className="w-full border border-indigo-200 p-3 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition"
          />
        </div>

        <Button
          onClick={posting}
          disabled={!uploadedUrls.length}
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
        >
          Create Post
        </Button>

        {uploadedUrls.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            {uploadedUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="uploaded"
                className="w-full h-24 object-cover rounded-md border"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
