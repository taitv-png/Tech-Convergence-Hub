import { LabDetailView, labDetailMetadata, labDetailParams } from "@/components/views/LabDetailView";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = labDetailParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return labDetailMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <LabDetailView locale="en" slug={slug} />;
}
