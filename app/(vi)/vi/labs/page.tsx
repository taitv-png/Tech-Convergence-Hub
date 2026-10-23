import { LabsView, labsMetadata } from "@/components/views/LabsView";

export const metadata = labsMetadata("vi");

export default function Page() {
  return <LabsView locale="vi" />;
}
