import categories from "@/data/research.json";
import articles from "@/data/articles.json";
import type { ChartSpec } from "@/components/ArticleChart";

export type Category = {
  slug: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
};

export type Block =
  | { kind: "html"; html: string }
  | { kind: "chart"; chart: ChartSpec }
  | { kind: "diagram"; source: string };

/** Metadata held in the index. The rendered body loads separately. */
export type ArticleVersion = {
  lang: string;
  title: string;
  summary: string;
  readingMinutes: number;
};

export type Article = {
  slug: string;
  category: string;
  date: string;
  tags: string[];
  hero: string | null;
  languages: string[];
  primaryLang: string;
  versions: Record<string, ArticleVersion>;
};

export const LANGUAGE_LABELS: Record<string, string> = { en: "English", ko: "한국어" };

export const allCategories = categories as Category[];
export const allArticles = articles as Article[];

const base = import.meta.env.BASE_URL;

export const findCategory = (slug?: string) => allCategories.find((c) => c.slug === slug);

export const articlesInCategory = (categorySlug: string) =>
  allArticles.filter((a) => a.category === categorySlug);

export const findArticle = (categorySlug?: string, articleSlug?: string) =>
  allArticles.find((a) => a.category === categorySlug && a.slug === articleSlug);


export const categoryUrl = (categorySlug: string) => `${base}research/${categorySlug}/`;

/**
 * The primary language lives at the article's base URL; any other language
 * hangs off it as a sub-path, so every version has a distinct, indexable URL.
 */
export const articleUrl = (article: Article, lang?: string) => {
  const root = `${base}research/${article.category}/${article.slug}/`;
  return !lang || lang === article.primaryLang ? root : `${root}${lang}/`;
};

/**
 * Rendered article bodies, one chunk per article and language. Vite turns this
 * glob into dynamic imports, so a reader only downloads the piece they open.
 */
const bodies = import.meta.glob<{ blocks: Block[] }>("../data/articles/*.json");

export async function loadArticleBody(
  categorySlug: string,
  articleSlug: string,
  lang: string,
): Promise<Block[]> {
  const loader = bodies[`../data/articles/${categorySlug}--${articleSlug}--${lang}.json`];
  if (!loader) return [];
  const module = await loader();
  const blocks = module.blocks ?? [];

  // Image sources are stored with a placeholder because the build step has no
  // way to know the site's base path. Resolve it here, where Vite does.
  return blocks.map((block) =>
    block.kind === "html"
      ? { ...block, html: block.html.replace(/@@BASE@@/g, base) }
      : block,
  );
}

export function formatDate(iso: string, lang: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export const readingLabel = (minutes: number, lang: string) =>
  lang === "ko" ? `${minutes}분 분량` : `${minutes} min read`;
