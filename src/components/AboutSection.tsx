import { TrendingUp, Shield, BarChart3, Cpu } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    title: "Algorithmic Alpha",
    description:
      "We deploy proprietary algorithms that identify and exploit market inefficiencies across asset classes with systematic precision.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description:
      "Our models process vast datasets — from traditional market data to alternative signals — uncovering patterns invisible to the human eye.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Rigorous risk controls are embedded at every level — from portfolio construction to real-time position monitoring and drawdown limits.",
  },
  {
    icon: TrendingUp,
    title: "Consistent Returns",
    description:
      "We target risk-adjusted returns with low correlation to traditional benchmarks, delivering value through market cycles.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold-muted font-medium mb-3">Who We Are</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy mb-6">
            Precision Meets Performance
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Axis11 Capital Limited is a quantitative investment management firm that leverages 
            advanced mathematical models, machine learning, and systematic trading strategies 
            to generate superior risk-adjusted returns for institutional and qualified investors.
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
