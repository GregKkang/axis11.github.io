import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleChart from "@/components/ArticleChart";
import ArticleDiagram from "@/components/ArticleDiagram";
import NotFound from "./NotFound";
import {
  type Block,
  LANGUAGE_LABELS,
  articleUrl,
  categoryUrl,
  findArticle,
  findCategory,
  formatDate,
  loadArticleBody,
  readingLabel,
} from "@/lib/content";

const Article = () => {
  const { category: categorySlug, slug, lang } = useParams();
  const article = findArticle(categorySlug, slug);
  const category = findCategory(categorySlug);

  // When no language is in the URL we are on the canonical (primary) version.
  const activeLang = lang ?? article?.primaryLang;
  const version = article && activeLang ? article.versions[activeLang] : undefined;

  const [blocks, setBlocks] = useState<Block[] | null>(null);

  useEffect(() => {
    if (version) document.title = `${version.title} | Axis11 Research`;
  }, [version]);

  useEffect(() => {
    if (!article || !activeLang) return;
    let cancelled = false;
    setBlocks(null);
    loadArticleBody(article.category, article.slug, activeLang).then((loaded) => {
      if (!cancelled) setBlocks(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [article, activeLang]);

  if (!article || !category || !version) return <NotFound />;

  const others = article.languages.filter((code) => code !== activeLang);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <header className="bg-navy pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto max-w-3xl px-6">
            <a
              href={categoryUrl(category.slug)}
              className="mb-10 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light"
            >
              <ArrowLeft className="h-4 w-4" />
              {category.title}
            </a>

            <h1 className="font-heading text-3xl leading-tight text-primary-foreground md:text-5xl">
              {version.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-foreground/60">
              <time dateTime={article.date}>{formatDate(article.date, version.lang)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingLabel(version.readingMinutes, version.lang)}</span>
              {others.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  {others.map((code) => (
                    <a
                      key={code}
                      href={articleUrl(article, code)}
                      hrefLang={code}
                      className="underline underline-offset-4 hover:text-gold"
                    >
                      {LANGUAGE_LABELS[code] ?? code}
                    </a>
                  ))}
                </>
              )}
            </div>
          </div>
        </header>

        <article className="container mx-auto max-w-3xl px-6 py-14 md:py-20">
          {blocks === null ? (
            <div className="space-y-4" aria-busy="true" aria-label="Loading article">
              <div className="h-4 w-full animate-pulse rounded bg-border" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-border" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-border" />
            </div>
          ) : (
            blocks.map((block, index) =>
              block.kind === "chart" ? (
                <ArticleChart key={index} spec={block.chart} lang={version.lang} />
              ) : block.kind === "diagram" ? (
                <ArticleDiagram key={index} source={block.source} />
              ) : (
                <div
                  key={index}
                  className="prose prose-axis11 max-w-none"
                  // Markdown is rendered to HTML at build time by
                  // scripts/build-content.mjs from files in this repository.
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              ),
            )
          )}

          {article.tags.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <a
            href={categoryUrl(category.slug)}
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-navy underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {version.lang === "ko" ? `${category.title} 글 전체 보기` : `All ${category.title} articles`}
          </a>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
