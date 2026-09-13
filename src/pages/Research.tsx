import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import categories from "@/data/research.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
const Research = () => {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  useEffect(() => { if (category) document.title = `${category.title} Research | Axis11`; }, [category]);
  if (!category) return <NotFound />;
  return <div className="min-h-screen bg-cream">
    <Navbar />
    <main>
      <header className="bg-navy pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <a href={`${import.meta.env.BASE_URL}#research`} className="inline-flex items-center gap-2 text-sm text-gold mb-10"><ArrowLeft className="h-4 w-4" />All research areas</a>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Axis11 Research / {category.number}</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground mb-6">{category.title}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/70">{category.description}</p>
        </div>
      </header>
      <section className="container mx-auto px-6 max-w-5xl py-16 md:py-24" aria-labelledby="coverage-title">
        <h2 id="coverage-title" className="font-heading text-2xl text-navy mb-6">Areas of focus</h2>
        <ul className="grid md:grid-cols-3 gap-4 mb-16">{category.topics.map((topic) => <li key={topic} className="border border-border rounded-lg bg-card p-6 text-navy">{topic}</li>)}</ul>
        <div className="rounded-lg border border-border bg-card p-8 md:p-12">
          <p className="text-xs uppercase tracking-widest text-gold-muted mb-3">Articles & Commentary</p>
          <h2 className="font-heading text-2xl text-navy mb-4">Research is on its way</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">No articles have been published in {category.title} yet. Future research and commentary will appear here.</p>
          <a href="mailto:greg.kkang@gmail.com" className="text-sm font-medium text-navy underline underline-offset-4">Suggest a topic to Greg</a>
        </div>
        <nav aria-label="Research areas" className="flex flex-wrap gap-3 mt-12">{categories.map((item) => <a key={item.slug} href={`${import.meta.env.BASE_URL}research/${item.slug}/`} aria-current={item.slug === slug ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm ${item.slug === slug ? "bg-navy text-primary-foreground border-navy" : "border-border text-navy hover:border-gold-muted"}`}>{item.title}</a>)}</nav>
      </section>
    </main>
    <Footer />
  </div>;
};
export default Research;
