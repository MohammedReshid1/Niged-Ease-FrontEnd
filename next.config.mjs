/** @type {import('next').NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Disable static optimization for pages that need dynamic data
  experimental: {
    // This ensures environment variables are available during build
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default config;
