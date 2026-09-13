const team = [
  {
    name: "Greg Kang",
    role: "Research & Commentary",
    bio: "Based in New Zealand, Greg shares a quantitative perspective on global markets, economic developments, and industry trends.",
    initials: "GK",
  },
];

const TeamSection = () => {
  return (
    <section id="author" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold-muted font-medium mb-3">The Author</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy mb-6">
            About Greg
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            A place to share research, test market hypotheses, and discuss the evidence behind an investment view.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
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
