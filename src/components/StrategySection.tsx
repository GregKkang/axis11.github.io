const strategies = [
  {
    number: "01",
    title: "Global Macro",
    description:
      "Inflation, interest rates, currencies, and policy: examining how economic changes affect global markets.",
  },
  {
    number: "02",
    title: "Equities & Technology",
    description:
      "Company fundamentals, valuations, and industry cycles, including semiconductors and AI infrastructure.",
  },
  {
    number: "03",
    title: "Commodities & Market Risk",
    description:
      "Supply and demand, energy markets, geopolitical developments, and the risks that connect asset classes.",
  },
];

const stats = [
  { value: "Data", label: "Evidence-led analysis" },
  { value: "Ideas", label: "Open discussion" },
  { value: "Multi", label: "Asset perspectives" },
  { value: "Global", label: "Market Coverage" },
];

const StrategySection = () => {
  return (
    <section id="research" className="py-24 md:py-32 bg-navy">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold font-medium mb-3">Research Focus</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">
            What We Explore
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-primary-foreground/60">
            Research will cover the themes below, connecting data with market context and clearly
            distinguishing observations from assumptions. Articles and commentary are coming soon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {strategies.map((s) => (
            <div
              key={s.number}
              className="relative border border-navy-light rounded-lg p-8 hover:border-gold/40 transition-all duration-300"
            >
              <span className="text-5xl font-heading font-bold text-gold/20">{s.number}</span>
              <h3 className="font-heading text-xl font-semibold text-primary-foreground mt-2 mb-3">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-primary-foreground/60">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-navy-light pt-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-heading font-bold text-gold">{stat.value}</p>
              <p className="text-xs tracking-widest uppercase text-primary-foreground/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
