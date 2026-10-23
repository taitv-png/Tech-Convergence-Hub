import { NewsView, newsMetadata } from "@/components/views/NewsView";

export const metadata = newsMetadata("vi");

export default function Page() {
  return <NewsView locale="vi" />;
}
