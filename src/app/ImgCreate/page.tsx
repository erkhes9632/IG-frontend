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
  const [imageUrl, setImageUrl] = useState("");
  const [captoinVal, setCaptionVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { myUser, token } = useUser();

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageUrl("");

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

      setImageUrl(uploaded.url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
        images: [imageUrl],
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
    <div className="p-2 max-w-md mx-auto relative bg-white rounded-xl ">
      <div className="flex items-center justify-center border-b border-gray-200 pb-3 relative">
        <button
          onClick={gopage}
          className="absolute left-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IconeX />
        </button>

        <div className="text-center text-lg font-semibold text-gray-800">
          New Photo Post
        </div>
      </div>

      <label
        htmlFor="prompt"
        className="block text-lg font-semibold mt-6 text-gray-800"
      >
        Explore AI Generated Images
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Describe what is on your mind. Be as specific as possible for best
        results.
      </p>

      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-28 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
        placeholder="A person walking in fog like Blade Runner 2049"
      />

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={generateImage}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>

      {imageUrl && (
        <div className="mt-6">
          <p className="text-sm text-gray-700 mb-2 font-medium">
            Generated Image:
          </p>
          <img src={imageUrl} alt="Generated" />
        </div>
      )}

      <div className="mt-6">
        <Input
          placeholder="Write your caption..."
          onChange={(e) => setCaptionVal(e.target.value)}
          value={captoinVal}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      <Button
        onClick={posting}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
      >
        Create Post
      </Button>
    </div>
  );
};

export default Page;
