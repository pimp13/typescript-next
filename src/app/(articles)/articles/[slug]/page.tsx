import type { Metadata } from "next";
import { ArticleReader } from "@/features/articles/public/article-reader";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replaceAll("-", " ")} · Funlife`,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  return <ArticleReader slug={slug} />;
}
