"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconeX } from "@/icons/iconeX";
import { useUser } from "@/providers/AuthProvider";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { push } = useRouter();

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [captoinVal, setCaptionVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { myUser, token } = useUser();

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImageUrl((prev) => {
        return [...prev, uploaded.url];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const posting = async () => {
    console.log(imageUrl);
    const response = await fetch(`backendUrl/posting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: myUser?._id,
        images: imageUrl,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 p-4">
      <div className="p-6 w-full max-w-md mx-auto relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-100 animate-fadeIn">
        <div className="flex items-center justify-center border-b border-indigo-100 pb-3 relative">
          <button
            onClick={gopage}
            className="absolute left-4 p-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <div className="w-5 h-5">
              <IconeX />
            </div>
          </button>
          <div className="text-center text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent tracking-wide">
            New Photo Post
          </div>
        </div>

        <label
          htmlFor="prompt"
          className="block text-lg font-semibold mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Explore AI Generated Images
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Describe what’s on your mind — be creative for the best results!
        </p>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-28 p-4 border border-indigo-200 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none shadow-sm transition"
          placeholder="A person walking in fog like Blade Runner 2049..."
        />

        <Button
          className="w-full mt-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={generateImage}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>

        {imageUrl && (
          <div className="mt-6">
            <p className="text-sm text-indigo-700 mb-2 font-medium">
              Generated Image:
            </p>
            <div className="overflow-hidden rounded-xl border border-indigo-100 shadow-md">
              {imageUrl.map((url) => {
                return <img src={url} key={url} alt="url" />;
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Input
            placeholder="Write your caption..."
            onChange={(e) => setCaptionVal(e.target.value)}
            value={captoinVal}
            className="w-full border border-indigo-200 p-3 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm shadow-sm transition"
          />
        </div>

        <Button
          onClick={posting}
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default Page;
