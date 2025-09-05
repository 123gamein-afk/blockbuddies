/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    YT_API_KEY: process.env.YT_API_KEY,
    CHANNEL_ID: process.env.CHANNEL_ID,
    SUB_GOAL: process.env.SUB_GOAL,
  },
  images: {
    domains: ['yt3.ggpht.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig
