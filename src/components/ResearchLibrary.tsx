import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { allArticles, allCategories, articleUrl, formatDate, LANGUAGE_LABELS } from "@/lib/content";

const ResearchLibrary = () => {
  const requested = new URLSearchParams(window.location.search).get("category") ?? "";
  const [category, setCategory] = useState(allCategories.some(c => c.slug === requested) ? requested : "");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const tags = [...new Set(allArticles.flatMap(article => article.tags))].sort();
  const filtered = [...allArticles].sort((a,b) => b.date.localeCompare(a.date)).filter(article => {
    const text = [article.category, ...article.tags, ...Object.values(article.versions).flatMap(v => [v.title, v.summary])].join(" ").toLowerCase();
    return (!category || article.category === category) && (!tag || article.tags.includes(tag)) && text.includes(query.trim().toLowerCase());
  });
  const reset = () => { setCategory(""); setTag(""); setQuery(""); };
  return <section id="research" className="bg-cream py-20 md:py-24 scroll-mt-16" aria-labelledby="research-title">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="mb-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-muted mb-3">The research library</p><h2 id="research-title" className="font-heading text-3xl md:text-5xl text-navy mb-4">Research & commentary</h2><p className="text-muted-foreground">Independent perspectives on markets, industries, and investment opportunities.</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-4 mb-6">
        <label className="block"><span className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Search articles</span><span className="relative block"><Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" aria-hidden="true"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title, topic, or keyword…" className="w-full rounded border border-border bg-card py-3 pl-10 pr-3 text-sm focus:outline-gold"/></span></label>
        <label className="block"><span className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Research area</span><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded border border-border bg-card p-3 text-sm focus:outline-gold"><option value="">All areas</option>{allCategories.map(c=><option value={c.slug} key={c.slug}>{c.title}</option>)}</select></label>
        <label className="block"><span className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Tag</span><select value={tag} onChange={e=>setTag(e.target.value)} className="w-full rounded border border-border bg-card p-3 text-sm focus:outline-gold"><option value="">All tags</option>{tags.map(t=><option value={t} key={t}>{t}</option>)}</select></label>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4 min-h-8"><p role="status" className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "article" : "articles"}</p>{(category || tag || query) && <button onClick={reset} className="text-sm text-navy underline underline-offset-4">Clear filters</button>}</div>
      <ol className="divide-y divide-border border-y border-border">{filtered.map(article=>{
        const version=article.versions[article.primaryLang];
        const area=allCategories.find(c=>c.slug===article.category);
        return <li key={`${article.category}/${article.slug}`} className="grid gap-4 py-8 md:grid-cols-[10rem_1fr] md:gap-8">
          <div className="text-sm"><time dateTime={article.date} className="text-gold-muted">{formatDate(article.date,"en")}</time><p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{area?.title}</p></div>
          <div><a href={articleUrl(article)} className="group"><h3 className="font-heading text-xl md:text-2xl font-semibold text-navy group-hover:text-gold-muted">{version.title}<ArrowUpRight aria-hidden="true" className="inline-block ml-2 h-4 w-4"/></h3><p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">{version.summary}</p></a>
          <div className="mt-4 flex flex-wrap gap-2">{article.tags.map(t=><button key={t} onClick={()=>setTag(tag===t?"":t)} aria-pressed={tag===t} aria-label={`Filter by tag ${t}`} className={`rounded-full border px-3 py-1 text-xs ${tag===t ? "border-navy bg-navy text-white" : "border-border text-navy hover:border-gold-muted"}`}>#{t}</button>)}</div>
          <div className="flex gap-4 mt-4">{article.languages.map(lang=><a key={lang} href={articleUrl(article,lang)} hrefLang={lang} className="text-xs font-medium text-navy underline underline-offset-4">{LANGUAGE_LABELS[lang]??lang}</a>)}</div>
          </div>
        </li>;
      })}</ol>
      {filtered.length===0 && <div className="py-14 text-center"><h3 className="font-heading text-xl text-navy mb-3">No matching articles</h3><p className="text-muted-foreground mb-5">Try another topic or clear the filters to see all research.</p><button onClick={reset} className="rounded bg-navy px-5 py-3 text-sm text-white">Show all articles</button></div>}
    </div>
  </section>;
};
export default ResearchLibrary;
