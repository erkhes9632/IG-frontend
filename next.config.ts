import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HF_API_KEY: process.env.HF_API_KEY ?? "",
    backendUrl: process.env.backendUrl ?? "http://localhost:8080",
  },
};

export default nextConfig;
