# rabea.sh

Minimal personal tech blog built with TanStack Start.

## Scripts

- `npm run dev` - start local dev server on port 3001
- `npm run build` - production build
- `npm run preview` - preview production build

## Content model

Posts live in `src/content/posts/*.md` and use frontmatter:

```yaml
---
title: "Post title"
description: "Short summary"
date: "2026-02-15"
author: "Rabea Bader"
tags:
  - engineering
draft: false
canonical: "https://rabea.sh/posts/post-slug"
coverImage: "/images/posts/post-slug/cover.jpg"
---
```

## Manual Notion -> website publishing workflow

1. In Notion, open the post page and export as **Markdown & CSV**.
2. Copy the markdown file into `src/content/posts/<slug>.md`.
3. If images were exported, move them into `public/images/posts/<slug>/`.
4. Update image paths inside markdown to `/images/posts/<slug>/...`.
5. Ensure frontmatter is complete (`title`, `description`, `date` required).
6. Run `npm run build` and verify `/posts` and `/posts/<slug>` locally.
7. Commit and deploy.

## Future comments section

Post pages already reserve a comments section so Giscus or Utterances can be added later without layout changes.
