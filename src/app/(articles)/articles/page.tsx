import type { Metadata } from "next";
import { ArticlesCatalog } from "@/features/articles/public/articles-catalog";

export const metadata: Metadata = {
  title: "Articles · Funlife",
  description: "Read stories and updates from Funlife",
};

export default function ArticlesPage() {
  return <ArticlesCatalog />;
}
