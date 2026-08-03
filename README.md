# TCH Next.js Project

Đây là bản convert từ static concept sang Next.js App Router.

## Cài và chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Flow

- Trang chủ `/`: Hero, Vision Section, Orbit Map và Partner Marquee.
- Trang danh mục lab: `/labs`.
- Trang lab detail: `/labs/[slug]`.
- Trang tin tức: `/news` và `/news/[id]`.
- Data: `data/labs.ts`.

## Tài liệu kỹ thuật

Xem [docs/TECHNICAL.md](docs/TECHNICAL.md) để đọc kiến trúc, route, mô hình dữ liệu, cấu hình deploy, quy trình cập nhật nội dung và checklist phát hành.

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
