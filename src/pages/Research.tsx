import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import {
  allCategories,
  articleUrl,
  articlesInCategory,
  categoryUrl,
  findCategory,
  formatDate,
  readingLabel,
} from "@/lib/content";

const Research = () => {
  const { category: slug } = useParams();
  const category = findCategory(slug);

  useEffect(() => {
    if (category) document.title = `${category.title} Research | Axis11`;
  }, [category]);

  if (!category) return <NotFound />;

  const articles = articlesInCategory(category.slug);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <header className="bg-navy pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="container mx-auto max-w-5xl px-6">
            <a
              href={`${import.meta.env.BASE_URL}#research`}
              className="mb-10 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light"
            >
              <ArrowLeft className="h-4 w-4" />
              All research areas
            </a>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Axis11 Research / {category.number}
            </p>
            <h1 className="mb-6 font-heading text-4xl text-primary-foreground md:text-6xl">{category.title}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/70">{category.description}</p>
          </div>
        </header>

        <section className="container mx-auto max-w-5xl px-6 py-16 md:py-24" aria-labelledby="coverage-title">
          <h2 id="coverage-title" className="mb-6 font-heading text-2xl text-navy">
            Areas of focus
          </h2>
          <ul className="mb-16 grid gap-4 md:grid-cols-3">
            {category.topics.map((topic) => (
              <li key={topic} className="rounded-lg border border-border bg-card p-6 text-navy">
                {topic}
              </li>
            ))}
          </ul>

          <h2 className="mb-6 font-heading text-2xl text-navy">Articles &amp; commentary</h2>

          {articles.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 md:p-12">
              <p className="mb-3 text-xs uppercase tracking-widest text-gold-muted">Articles &amp; Commentary</p>
              <h3 className="mb-4 font-heading text-2xl text-navy">Research is on its way</h3>
              <p className="mb-6 max-w-2xl leading-relaxed text-muted-foreground">
                No articles have been published in {category.title} yet. Future research and commentary will
                appear here.
              </p>
              <a
                href="mailto:greg.kkang@gmail.com"
                className="text-sm font-medium text-navy underline underline-offset-4"
              >
                Suggest a topic to Greg
              </a>
            </div>
          ) : (
            <ol className="divide-y divide-border border-y border-border">
              {articles.map((article) => {
                const version = article.versions[article.primaryLang];
                return (
                  <li key={article.slug}>
                    <a
                      href={articleUrl(article)}
                      className="group grid gap-2 py-7 sm:grid-cols-[9rem_1fr] sm:gap-6"
                    >
                      <div className="flex flex-col gap-1 pt-1 text-sm text-gold-muted">
                        <time dateTime={article.date} className="tabular-nums">
                          {formatDate(article.date, article.primaryLang)}
                        </time>
                        <span className="text-xs text-muted-foreground">
                          {readingLabel(version.readingMinutes, article.primaryLang)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-navy group-hover:text-gold-muted">
                          {version.title}
                        </h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{version.summary}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-navy">
                          Read
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          {article.languages.length > 1 && (
                            <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground">
                              {article.languages.join(" · ")}
                            </span>
                          )}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ol>
          )}

          <nav aria-label="Research areas" className="mt-12 flex flex-wrap gap-3">
            {allCategories.map((item) => (
              <a
                key={item.slug}
                href={categoryUrl(item.slug)}
                aria-current={item.slug === slug ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm ${
                  item.slug === slug
                    ? "border-navy bg-navy text-primary-foreground"
                    : "border-border text-navy hover:border-gold-muted"
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Research;
