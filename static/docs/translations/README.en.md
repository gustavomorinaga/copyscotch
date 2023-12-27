# Google-Like Search Engine

🔍 Simple implementation of a Google-like search engine using [TypeScript](https://www.typescriptlang.org/) and [SvelteKit](https://kit.svelte.dev/).

<p align="left">
  <a href="/LICENSE" title="Show the MIT License">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT">
  </a>
  <a href="https://kit.svelte.dev" title="Open SvelteKit Website">
    <img src="https://img.shields.io/badge/SvelteKit-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00" alt="Made with SvelteKit" />
  </a>
  <a href="https://www.typescriptlang.org/docs" title="Open TypeScript Website">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="Made with TypeScript" />
  </a>
  <a href="https://tailwindcss.com" title="Open Tailwind Website">
    <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Made with Tailwind" />
  </a>
</p>

## 🌎 Translations

<kbd>[<img title="English" alt="English" src="https://flagicons.lipis.dev/flags/4x3/us.svg" width="22">](/static/docs/translations/README.en.md)</kbd>
<kbd>[<img title="Português Brasileiro" alt="Português Brasileiro" src="https://flagicons.lipis.dev/flags/4x3/br.svg" width="22">](/static/docs/translations/README.pt.md)</kbd>

## Introduction

This project is a simple search engine that mimics the Google search engine.

The Google search engine is a very complex system, but I tried to make it as simple as possible. The app is based on a JSON file that contains the data of simple articles that are displayed on the page. The search engine must be able to search for articles by title, description, and content.

Cases that the search engine must be able to handle:

- Search for articles by title, description, and content.
- Use search operators to filter the results by:
  - exact phrase (e.g., "hello world")
  - any of the words (e.g., hello world)
  - include keywords (e.g., +hello +world)
  - exclude keywords (e.g., -hello -world)
- Register the number of results found.
- Register the time it took to perform the search.
- Highlight the keywords in the results.

## Tech Stack

| Tool/Service                                      | Category                    | Description                                                                         |
| ------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| [Vite](https://vitejs.dev/)                       | Build Tools                 | A build tool that provides a faster development experience for modern web projects. |
| [CSSNANO](https://cssnano.co/)                    | CSS                         | A modular minifier, built on top of the PostCSS ecosystem.                          |
| [PostCSS](https://postcss.org)                    | CSS                         | A tool for transforming CSS with JavaScript.                                        |
| [Tailwind CSS](https://tailwindcss.com/)          | CSS                         | A utility-first CSS framework.                                                      |
| [ESLint](https://eslint.org/)                     | JavaScript/TypeScript Tools | A tool for identifying and reporting on patterns in ECMAScript/JavaScript code.     |
| [Prettier](https://prettier.io/)                  | JavaScript/TypeScript Tools | An opinionated code formatter.                                                      |
| [TypeScript](https://www.typescriptlang.org/)     | JavaScript/TypeScript Tools | A typed superset of JavaScript that compiles to plain JavaScript.                   |
| [shadcn-svelte](https://www.shadcn-svelte.com/)   | UI Components               | Accessible and customizable components that you can copy and paste into your apps.  |
| [TanStack Virtual](https://tanstack.com/virtual/) | UI Components               | Headless UI for Virtualizing Large Element Lists                                    |
| [SvelteKit](https://kit.svelte.dev/)              | Web Frameworks              | A framework for building high-performance web apps.                                 |

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](/LICENSE) page for details.

<p align="center">
 ❤️ Thanks for your attention!
</p>
