"use client";
import { Button } from "@/components/ui/button";
import { IconePIC } from "@/icons/iconePIC";
import { IconeX } from "@/icons/iconeX";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const gopage = () => {
    router.push("/ImgCreate");
  };
  const gopage2 = () => {
    router.push("/");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <button onClick={gopage2} className="absolute top-4 left-4">
        <IconeX />
      </button>

      <div className="text-center text-lg font-semibold border-b border-gray-300 pb-3 mt-4">
        New photo post
      </div>

      <div className="flex flex-col items-center justify-center mt-16 space-y-6">
        <IconePIC />

        <Button className="bg-blue-500 w-[147px]">Photo library</Button>

        <button className="text-blue-500 text-sm font-medium" onClick={gopage}>
          Generate with AI
        </button>
      </div>
    </div>
  );
};

export default page;
