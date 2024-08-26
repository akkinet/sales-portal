/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
//   api: {
//     bodyParser: true,
//     middleware: [
//         import('./app/api/middleware').default,
//     ],
//   },
};

export default nextConfig;
