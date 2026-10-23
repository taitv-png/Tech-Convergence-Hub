import { NewsView, newsMetadata } from "@/components/views/NewsView";

export const metadata = newsMetadata("en");

export default function Page() {
  return <NewsView locale="en" />;
}
