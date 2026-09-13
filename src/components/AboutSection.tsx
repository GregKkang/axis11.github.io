import { TrendingUp, Shield, BarChart3, Cpu } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    title: "Quantitative Research",
    description:
      "Exploring market behaviour through data, factor analysis, and systematic research.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description:
      "Connecting economic releases, company fundamentals, and market signals to develop clearly reasoned views.",
  },
  {
    icon: Shield,
    title: "Risk & Scenarios",
    description:
      "Examining alternative outcomes, challenging assumptions, and identifying what could change a market view.",
  },
  {
    icon: TrendingUp,
    title: "Market Commentary",
    description:
      "Putting market developments in context, with a focus on evidence, uncertainty, and the longer-term picture.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold-muted font-medium mb-3">About Axis11</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy mb-6">
            Research. Perspective. Discussion.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Axis11 is a New Zealand-based platform for investment research and market commentary.
            It brings a quantitative perspective to global markets, sharing analysis and ideas
            for readers interested in understanding the forces behind market moves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group bg-card rounded-lg p-6 border border-border hover:border-gold/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-md bg-navy flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300">
                <pillar.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-navy mb-2">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
