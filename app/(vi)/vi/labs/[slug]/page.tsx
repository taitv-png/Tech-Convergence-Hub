import { LabDetailView, labDetailMetadata, labDetailParams } from "@/components/views/LabDetailView";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = labDetailParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return labDetailMetadata("vi", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <LabDetailView locale="vi" slug={slug} />;
}
