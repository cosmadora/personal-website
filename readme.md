# Adoras Website

Personal website, CV and portfolio for myself 🌷.

This site is built with [Astro](https://docs.astro.build/), with mostly static content and a few interactive [Vue.js](https://vuejs.org) islands where useful.

## Tech stack

- [Astro](https://docs.astro.build/) 7
- [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/) for Markdown pages with components
- [Vue](https://docs.astro.build/en/guides/integrations-guide/vue/) 3 for interactive components
- [Sass / SCSS](https://sass-lang.com/documentation/) for styling
- [Sharp](https://sharp.pixelplumbing.com/) for image processing through Astro
- Astro i18n for the German `/de/found/` page

## Prerequisites

- [Node.js](https://nodejs.org/en/download) `>=22.12.0`
- [pnpm](https://pnpm.io/installation)

## Development

Install dependencies:

```sh
pnpm install --frozen-lockfile
```

Start the local development server:

```sh
pnpm dev
```

Build the production site:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

## Project structure

```text
src/
  assets/       Images imported by Astro components
  components/   Reusable Astro and Vue components
  content/      Structured content collections, e.g. CV entries
  layouts/      Shared page layouts
  pages/        File-based routes
  styles/       Global SCSS styles
public/         Static files served as-is
```

## Useful docs

- [Astro documentation](https://docs.astro.build/)
- [Astro project structure](https://docs.astro.build/en/basics/project-structure/)
- [Astro MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Astro Vue integration](https://docs.astro.build/en/guides/integrations-guide/vue/)
- [Astro i18n](https://docs.astro.build/en/guides/internationalization/)
- [pnpm CLI](https://pnpm.io/pnpm-cli)
- [Sass documentation](https://sass-lang.com/documentation/)
