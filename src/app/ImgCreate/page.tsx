"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconeX } from "@/icons/iconeX";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageUrl("");
    try {
      const header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };
      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: header,
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
        throw new Error(`HTTP error! status: $(response.status)`);
      }
      const blobs = await response.blob();
      const ImgUrl = URL.createObjectURL(blobs);

      const file = new File([blobs], "generated. png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImageUrl(ImgUrl);
    } catch (err) {
      console.log("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const gopage = () => {
    router.push("/Create");
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={gopage}>
        <IconeX />
      </button>
      <div className="text-lg font-medium mt-4 border-b border-black text-center">
        New photo post
      </div>

      <label htmlFor="prompt" className="mt-6 text-xl font-bold">
        Explore AI generated images
      </label>
      <div className="text-sm text-gray-600 mt-2 mb-4">
        Describe what's on your mind. For best results, be specific
      </div>

      <div className="flex flex-col space-y-4">
        <Input
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-24 p-4 text-base"
          placeholder="Example: I'm walking in fog like Bladerunner 2049"
        />
        <Button
          className="bg-blue-500 w-[147px] self-start mt-4"
          onClick={generateImage}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>

        {imageUrl && (
          <div>
            <div>Generated image:</div>
            <img src={imageUrl} alt="AI Generated Img" />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
