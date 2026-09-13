import { ArrowUpRight } from "lucide-react";
import categories from "@/data/research.json";
const StrategySection = () => (
  <section id="research" className="py-24 md:py-32 bg-navy">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-sm tracking-widest uppercase text-gold font-medium mb-3">Research Focus</p>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">What We Explore</h2>
        <p className="text-base md:text-lg leading-relaxed text-primary-foreground/60">Explore research and commentary across four areas, connecting data with market context and distinguishing observations from assumptions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {categories.map((category) => <a key={category.slug} href={`${import.meta.env.BASE_URL}research/${category.slug}/`} className="group flex flex-col relative border border-navy-light rounded-lg p-7 hover:border-gold/60 focus-visible:outline-gold transition-colors">
          <span className="text-5xl font-heading font-bold text-gold/30">{category.number}</span>
          <h3 className="font-heading text-xl font-semibold text-primary-foreground mt-4 mb-3">{category.title}</h3>
          <p className="text-sm leading-relaxed text-primary-foreground/65 mb-8">{category.description}</p>
          <span className="mt-auto inline-flex items-center gap-2 text-sm text-gold">Explore research <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
        </a>)}
      </div>
    </div>
  </section>
);
export default StrategySection;
