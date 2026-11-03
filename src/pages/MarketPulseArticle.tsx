import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { loadPulseBody, pulseDate, pulsePosts, pulseUrl } from "@/lib/market-pulse";

export default function MarketPulseArticle() {
  const { date } = useParams();
  const post = pulsePosts.find((p) => p.date === date);
  const method = date === "method";
  const [body, setBody] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const title = method ? "Model and source notes" : post?.title;
  useEffect(() => {
    if (title) document.title = `${post ? post.date + " · " : ""}${title} | Axis11 Market Pulse`;
  }, [title, post]);
  useEffect(() => {
    if (!date || (!post && !method)) return;
    let cancelled = false;
    setBody(null); setFailed(false);
    loadPulseBody(date).then((html) => { if (!cancelled) setBody(html); }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [date, post, method]);
  if (!title) return <NotFound />;
  const position = post ? pulsePosts.indexOf(post) : -1;
  const newer = position > 0 ? pulsePosts[position - 1] : null;
  const older = position >= 0 ? pulsePosts[position + 1] : null;
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">
        <header className="bg-navy pt-28 pb-12 md:pt-36 md:pb-16 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-6">
            <a href={`${import.meta.env.BASE_URL}market-pulse/`} className="mb-7 inline-flex items-center gap-2 text-sm text-gold hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Market Pulse</a>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">{post ? "U.S. Market Briefing" : "Methodology"}</p>
            <h1 className="font-heading text-3xl leading-tight md:text-5xl">{title}</h1>
            {post && <p className="mt-6 text-sm text-primary-foreground/70">Trading session: <time dateTime={post.date}>{pulseDate(post.date)}</time><span aria-hidden="true"> · </span>{post.readingMinutes} min read</p>}
          </div>
        </header>
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          {failed ? <p role="alert">The briefing could not be loaded. Please reload this page.</p> : body === null ? <p aria-busy="true">Loading briefing…</p> : <div className="prose prose-axis11 max-w-none [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words" dangerouslySetInnerHTML={{ __html: body }} />}
          {post && <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">Published <time dateTime={post.publishedAt}>{pulseDate(post.publishedAt.slice(0, 10))}</time>. The date above identifies the U.S. trading session.</p>}
          <nav aria-label="Briefing navigation" className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6 text-sm text-navy">
            {older ? <a href={pulseUrl(older.date)} className="inline-flex items-center gap-2 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{pulseDate(older.date)}</a> : <a href={`${import.meta.env.BASE_URL}market-pulse/`} className="hover:underline">All briefings</a>}
            {newer && <a href={pulseUrl(newer.date)} className="inline-flex items-center gap-2 hover:underline">{pulseDate(newer.date)}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>}
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
}
