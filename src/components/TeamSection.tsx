const team = [
  {
    name: "Coming Soon",
    role: "Chief Executive Officer",
    bio: "Details about the leadership team will be shared in due course.",
    initials: "CEO",
  },
  {
    name: "Coming Soon",
    role: "Chief Investment Officer",
    bio: "Our CIO brings decades of quantitative research and portfolio management experience.",
    initials: "CIO",
  },
  {
    name: "Coming Soon",
    role: "Head of Research",
    bio: "Leading our systematic research efforts across machine learning and financial engineering.",
    initials: "HoR",
  },
  {
    name: "Coming Soon",
    role: "Head of Technology",
    bio: "Architecting our low-latency infrastructure and data pipeline for real-time execution.",
    initials: "HoT",
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold-muted font-medium mb-3">Our People</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy mb-6">
            Leadership Team
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Our team brings together expertise from quantitative finance, computer science, 
            mathematics, and engineering from leading institutions worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-navy mx-auto mb-4 flex items-center justify-center">
                <span className="text-sm font-semibold tracking-wider text-gold">{member.initials}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-navy">{member.name}</h3>
              <p className="text-xs tracking-widest uppercase text-gold-muted mt-1 mb-3">{member.role}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
