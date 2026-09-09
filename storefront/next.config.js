const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
  },
  images: {
    qualities: [50, 75],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME || "example.invalid",
      },
      {
        protocol: "https",
        hostname: "**.t3.storageapi.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-ffc6a569edf8409b994a6005580988b1.r2.dev",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig
