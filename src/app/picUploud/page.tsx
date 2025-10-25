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

  const [captoinVal, setCaptionVal] = useState("");
  const { myUser, token } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [upFile, setUpFile] = useState<string>();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const uploudeFile = async () => {
    if (!file) return;
    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    console.log(uploaded.url);
    setUpFile(uploaded.url);
    if (uploaded) {
      toast.success("Succsesfuly uploude img...");
    } else {
      toast.error("Check it again !!!");
    }
  };

  const posting = async () => {
    console.log(myUser);
    const response = await fetch(`http://localhost:8080/posting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: myUser?._id,
        images: [upFile],
        caption: captoinVal,
      }),
    });
    if (response) {
      toast.success("Succsesfuly create post...");
      push("/");
    } else {
      toast.error("Check it again !!!");
    }
  };

  const gopage = () => {
    push("/create");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="p-5 w-full max-w-md mx-auto relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-center border-b border-indigo-100 pb-3 relative">
          <button
            onClick={gopage}
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

        {/* Upload Input */}
        <div className="mt-6">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full border border-indigo-200 p-3 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition"
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={uploudeFile}
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
        >
          Upload
        </Button>

        {/* Caption Input */}
        <div className="mt-6">
          <Input
            placeholder="Write your caption..."
            onChange={(e) => setCaptionVal(e.target.value)}
            value={captoinVal}
            className="w-full border border-indigo-200 p-3 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition"
          />
        </div>

        {/* Create Button */}
        <Button
          onClick={posting}
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default Page;
