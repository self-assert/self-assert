import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
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
    [
      "meta",
      {
        name: "google-site-verification",
        content: "cTUKnbqvGsqzxM1IrYA89CmxyN_Yih7bo8_cHB6tzbM",
      },
    ],
  ],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
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
        text: "Examples",
        items: [
          { text: "Using Rules", link: "/examples/using-rules" },
          {
            text: "DraftAssistant for a Date field",
            link: "/examples/date-draft-assistant",
          },
        ],
      },
      {
        text: "API",
        items: [
          {
            text: "Overview",
            link: "/api/",
            collapsed: false,
          },
          ...typedocSidebar.filter((item) => item.text !== "Others"),
        ],
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
    outline: {
      level: [2, 3],
    },
  },
});
