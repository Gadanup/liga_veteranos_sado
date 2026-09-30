/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework version.
  poweredByHeader: false,

  images: {
    formats: ["image/webp"],
    // Once the photos move to Supabase Storage (step 2.3.1), add:
    // remotePatterns: [
    //   { protocol: "https", hostname: "dmsocybvdzdzafpemybt.supabase.co" },
    // ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // No Content-Security-Policy on purpose: MUI and emotion inject inline
  // styles, so a policy without 'unsafe-inline' breaks the stylesheet and one
  // with it protects very little. Revisit after C11 settles on one styling
  // approach.
};

export default nextConfig;
