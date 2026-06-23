# TCH Next.js Project

Đây là bản convert từ static concept sang Next.js App Router.

## Cài và chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Flow

- Trang chủ `/`: Hero, Orbit Map, Lab Directory, News & Signals, System Pathway.
- Trang lab detail: `/labs/[slug]`.
- Data: `data/labs.ts`.

## Dùng Codex

Sau khi unzip, mở thư mục này trong VS Code/Cursor rồi chạy:

```bash
codex
```

Prompt gợi ý:

```txt
Read the current Next.js app. Keep the dark technology concept and orbit map. Improve the homepage lab directory layout. Do not add GSAP yet. Preserve responsive behavior and route /labs/[slug]. Run npm run build and fix any errors.
```

## GSAP

Dependency `gsap` đã có sẵn trong package.json để gắn animation sau.
