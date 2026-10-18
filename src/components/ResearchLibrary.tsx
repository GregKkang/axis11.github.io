import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { allArticles, allCategories, articleUrl, formatDate, LANGUAGE_LABELS } from "@/lib/content";

const PAGE_SIZE = 10;

const ResearchLibrary = () => {
  const requested = new URLSearchParams(window.location.search).get("category") ?? "";
  const [category, setCategory] = useState(allCategories.some(c => c.slug === requested) ? requested : "");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = [...allArticles].sort((a,b) => b.date.localeCompare(a.date)).filter(article => {
    const text = [article.category, ...article.tags, ...Object.values(article.versions).flatMap(v => [v.title, v.summary])].join(" ").toLowerCase();
    return (!category || article.category === category) && text.includes(query.trim().toLowerCase());
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleArticles = filtered.slice(start, start + PAGE_SIZE);
  const reset = () => { setCategory(""); setQuery(""); setPage(1); };
  const changePage = (next: number) => {
    setPage(next);
    document.getElementById("research-title")?.focus({ preventScroll: true });
    document.getElementById("research")?.scrollIntoView({ block: "start" });
  };
  return <section id="research" className="bg-cream py-8 md:py-10 scroll-mt-16" aria-labelledby="research-title">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="mb-6 flex items-center justify-between"><h2 id="research-title" tabIndex={-1} className="font-heading text-2xl md:text-3xl text-navy">Research & commentary</h2></div>
      <div className="grid sm:grid-cols-[2fr_1fr] gap-4 mb-6">
        <label className="block"><span className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Search articles</span><span className="relative block"><Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" aria-hidden="true"/><input type="search" value={query} onChange={e=>{ setQuery(e.target.value); setPage(1); }} placeholder="Title, topic, or tag…" className="w-full rounded border border-border bg-card py-3 pl-10 pr-3 text-sm focus:outline-gold"/></span></label>
        <label className="block"><span className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Research area</span><select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} className="w-full rounded border border-border bg-card p-3 text-sm focus:outline-gold"><option value="">All areas</option>{allCategories.map(c=><option value={c.slug} key={c.slug}>{c.title}</option>)}</select></label>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4 min-h-8"><p role="status" className="text-sm text-muted-foreground">{filtered.length > PAGE_SIZE ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} articles` : `${filtered.length} ${filtered.length === 1 ? "article" : "articles"}`}</p>{(category || query) && <button onClick={reset} className="text-sm text-navy underline underline-offset-4">Clear filters</button>}</div>
      <ol className="divide-y divide-border border-y border-border">{visibleArticles.map((article, index)=>{
        const featured = currentPage === 1 && index === 0 && !category && !query.trim();
        const version=article.versions[article.primaryLang];
        const area=allCategories.find(c=>c.slug===article.category);
        return <li key={`${article.category}/${article.slug}`} className={`grid gap-3 md:grid-cols-[9rem_1fr] md:gap-6 ${featured ? "my-5 rounded-lg bg-navy p-6 md:p-9 text-white" : "py-5"}`}>
          <div className="text-sm">{featured && <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Latest research</p>}<time dateTime={article.date} className={featured ? "text-white/70" : "text-gold-muted"}>{formatDate(article.date,"en")}</time><p className={`mt-2 text-xs uppercase tracking-wider ${featured ? "text-gold" : "text-muted-foreground"}`}>{area?.title}</p></div>
          <div><a href={articleUrl(article)} className="group"><h3 className={`font-heading font-semibold ${featured ? "text-2xl md:text-4xl leading-tight text-white group-hover:text-gold" : "text-lg md:text-xl text-navy group-hover:text-gold-muted"}`}>{version.title}<ArrowUpRight aria-hidden="true" className="inline-block ml-2 h-4 w-4"/></h3><p className={`mt-3 leading-relaxed ${featured ? "text-sm md:text-base text-white/75" : "text-sm text-muted-foreground line-clamp-2"}`}>{version.summary}</p></a>
          <div className="mt-3 flex flex-wrap gap-2">{article.tags.map(t=><span key={t} className={`rounded-full border px-2.5 py-0.5 text-xs ${featured ? "border-white/20 text-white/70" : "border-border text-muted-foreground"}`}>#{t}</span>)}</div>
          <div className="flex gap-4 mt-3">{article.languages.map(lang=><a key={lang} href={articleUrl(article,lang)} hrefLang={lang} className={`text-xs font-medium underline underline-offset-4 ${featured ? "text-white hover:text-gold" : "text-navy"}`}>{LANGUAGE_LABELS[lang]??lang}</a>)}</div>
          </div>
        </li>;
      })}</ol>
      {pageCount > 1 && <nav aria-label="Research pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="rounded border border-border px-4 py-2 text-sm text-navy disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(number => <button type="button" key={number} onClick={() => changePage(number)} aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} className={`min-w-10 rounded border px-3 py-2 text-sm ${number === currentPage ? "border-navy bg-navy text-white" : "border-border text-navy hover:border-gold-muted"}`}>{number}</button>)}
        <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === pageCount} className="rounded border border-border px-4 py-2 text-sm text-navy disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </nav>}
      {filtered.length===0 && <div className="py-14 text-center"><h3 className="font-heading text-xl text-navy mb-3">No matching articles</h3><p className="text-muted-foreground mb-5">Try another topic or clear the filters to see all research.</p><button onClick={reset} className="rounded bg-navy px-5 py-3 text-sm text-white">Show all articles</button></div>}
    </div>
  </section>;
};
export default ResearchLibrary;
