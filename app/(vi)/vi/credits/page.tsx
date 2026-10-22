import { CreditsView, creditsMetadata } from "@/components/views/CreditsView";

export const metadata = creditsMetadata("vi");

export default function Page() {
  return <CreditsView locale="vi" />;
}
