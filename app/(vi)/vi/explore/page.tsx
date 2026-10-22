import { ExploreView, exploreMetadata } from "@/components/views/ExploreView";

export const metadata = exploreMetadata("vi");

export default function Page() {
  return <ExploreView locale="vi" />;
}
