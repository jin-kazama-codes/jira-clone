/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/project",
  //       destination: "/project",
  //       permanent: true,
  //     },
  //     {
  //       source: "/",
  //       destination: "/project",
  //       permanent: true,
  //     },
  //   ];
  // },
  images: {
    domains: [
      "www.gravatar.com",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "img.clerk.com",
      'karya-io.s3.amazonaws.com',
    ],
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};
export default config;
