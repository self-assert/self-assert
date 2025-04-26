import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "self-assert",
  description: "A small TypeScript library for designing objects that are responsible for their own validity.",
  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/self-assert/favicon.ico" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/self-assert/favicon-32x32.png" }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/self-assert/favicon-16x16.png" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/self-assert/apple-touch-icon.png" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "API", link: "/api/" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is self-assert?", link: "/what-is-self-assert" },
          { text: "Getting started", link: "/getting-started" },
        ],
      },
      {
        text: "API",
        items: typedocSidebar,
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/self-assert/self-assert" }],
  },
  cleanUrls: true,
  base: "/self-assert/",
});
