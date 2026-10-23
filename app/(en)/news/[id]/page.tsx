import { NewsDetailView, newsDetailMetadata, newsDetailParams } from "@/components/views/NewsView";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = newsDetailParams;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return newsDetailMetadata("en", id);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <NewsDetailView locale="en" id={id} />;
}
