import { LabsView, labsMetadata } from "@/components/views/LabsView";

export const metadata = labsMetadata("en");

export default function Page() {
  return <LabsView locale="en" />;
}
