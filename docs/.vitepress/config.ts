import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";
import { description, name, repository } from "../../package.json";

const repositoryUrl = `${repository.url
  .replace(/^git\+/, "")
  .replace(/\.git$/, "")}`;
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: name,
  description: description,
  head: [
    [
      "link",
      { rel: "icon", type: "image/x-icon", href: "/self-assert/favicon.ico" },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/self-assert/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/self-assert/favicon-16x16.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/self-assert/apple-touch-icon.png",
      },
    ],
  ],
  cleanUrls: true,
  base: "/self-assert/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "API", link: "/api/" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is self-assert?", link: "/what-is-self-assert" },
          { text: "Why self-assert?", link: "/why-self-assert" },
          { text: "Getting started", link: "/getting-started" },
          { text: "Acknowledgements", link: "/acknowledgements" },
        ],
      },
      {
        text: "API",
        items: typedocSidebar,
      },
    ],
    editLink: {
      pattern: `${repositoryUrl}/edit/main/docs/:path`,
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
    socialLinks: [{ icon: "github", link: repositoryUrl }],
  },
});
