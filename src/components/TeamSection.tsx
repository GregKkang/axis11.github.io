const experience = [
  { years: "2022–2026", firm: "Pie Funds", role: "Investment Analyst: Global & ESG" },
  { years: "2013–2022", firm: "Eastspring Investments", role: "Head of Research Team / Senior Portfolio Manager" },
  { years: "2009–2013", firm: "Nomura Financial Investments", role: "Equity Research Analyst" },
  { years: "2007–2009", firm: "Woori I&S", role: "Equity Research Associate" },
];

const TeamSection = () => (
  <section id="author" className="bg-cream py-20 md:py-24">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold-muted">The Author</p>
          <h2 className="mb-5 font-heading text-3xl font-semibold text-navy md:text-4xl">Greg Kang</h2>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Nearly two decades of investment research and portfolio management across New Zealand and Korea,
            combining fundamental analysis with quantitative and factor research.
          </p>
        </div>
        <ol aria-label="Professional experience" className="divide-y divide-navy/10 border-y border-navy/10">
          {experience.map((job) => (
            <li key={job.firm} className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr] sm:gap-5">
              <p className="pt-1 text-sm font-medium tabular-nums text-gold-muted">{job.years}</p>
              <div>
                <h3 className="font-heading text-xl font-semibold text-navy">{job.firm}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{job.role}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default TeamSection;
