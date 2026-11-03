import { useEffect } from "react";
import { Activity, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pulseDate, pulseGap, pulsePercent, pulsePosts, pulseUrl } from "@/lib/market-pulse";

const MarketPulse = () => {
  useEffect(() => { document.title = "Market Pulse | Axis11 Research"; }, []);
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pt-16">
        <header className="bg-navy-dark text-primary-foreground py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">AXIS11 · Daily market analysis</p>
            <h1 className="font-heading text-4xl md:text-6xl">Market Pulse</h1>
            <p className="mt-5 max-w-2xl text-lg md:text-xl leading-relaxed text-primary-foreground/80">AI-generated indicators that put daily market moves in context.</p>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-primary-foreground/60">A daily view of the market, using AI to turn news and price movements into quantitative indicators. Explore how the market narrative is changing and how it relates to observed returns.</p>
          </div>
        </header>
        <section aria-labelledby="daily-update-title" className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-6"><Activity aria-hidden="true" className="h-5 w-5 text-gold-muted" /><h2 id="daily-update-title" className="font-heading text-2xl text-navy">Daily indicators</h2></div>
          {pulsePosts.length > 0 ? (
            <ol className="space-y-5" aria-label="Daily market briefings">
              {pulsePosts.map((post) => (
                <li key={post.date}>
                  <article className="rounded-lg border border-border bg-card p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold-muted"><time dateTime={post.date}>{pulseDate(post.date)}</time> · U.S. trading session</p>
                    <h3 className="mt-3 font-heading text-2xl text-navy"><a href={pulseUrl(post.date)} className="hover:underline underline-offset-4">{post.title}</a></h3>
                    <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">{post.summary}</p>
                    <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
                      <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">S&amp;P 500 actual</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-navy">{pulsePercent(post.actualReturn)}</dd></div>
                      <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Model estimate</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-navy">{pulsePercent(post.modelReturn)}</dd></div>
                      <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Actual minus model</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-navy">{pulseGap(post.gap)}</dd></div>
                    </dl>
                    <a href={pulseUrl(post.date)} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy underline underline-offset-4" aria-label={`Read the ${pulseDate(post.date)} briefing`}>Read the briefing <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
                  </article>
                </li>
              ))}
            </ol>
          ) : <div className="rounded-lg border border-border bg-card p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest font-semibold text-gold-muted">Coming soon</p>
            <h3 className="mt-4 font-heading text-2xl text-navy">The first update is on its way.</h3>
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">Daily readings will appear here once the first dataset is published. Each update will include its observation date and an explanation of what the indicators measure.</p>
            <a href={import.meta.env.BASE_URL} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy underline underline-offset-4">Explore our research <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
          </div>}
          <a href={pulseUrl("method")} className="mt-8 inline-block text-sm font-medium text-navy underline underline-offset-4">Model and source notes</a>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">Market Pulse focuses on interpreting observed market moves. AI-generated readings are model estimates; they do not establish causation or guarantee future returns.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default MarketPulse;
