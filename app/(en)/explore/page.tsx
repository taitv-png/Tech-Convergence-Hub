import { ExploreView, exploreMetadata } from "@/components/views/ExploreView";

export const metadata = exploreMetadata("en");

export default function Page() {
  return <ExploreView locale="en" />;
}
