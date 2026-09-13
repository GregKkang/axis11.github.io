const experience = [
  { dates: "Jul 2022 – Mar 2026", title: "Investment Analyst: Global & ESG", firm: "Pie Funds", location: "Auckland, New Zealand", detail: "Fundamental equity research across the U.S. and Asia, focusing on semiconductors, software, and renewable energy. Built global multi-factor models and Python/Bloomberg BQL research pipelines, and led internal ESG scoring and supported climate-related disclosure." },
  { dates: "Mar 2013 – May 2022", title: "Head of Research Team / Senior Portfolio Manager", firm: "Eastspring Investments", location: "Seoul, Korea", detail: "Led research and managed portfolios across retail pension funds, institutional mandates, and IPO funds." },
  { dates: "Oct 2009 – Mar 2013", title: "Equity Research Analyst", firm: "Nomura Financial Investments", location: "Seoul, Korea", detail: "Published industry and company research covering IT hardware and displays." },
  { dates: "Apr 2007 – Sep 2009", title: "Equity Research Associate", firm: "Woori I&S", location: "Seoul, Korea", detail: "Supported industry and company research covering IT hardware." },
];
const TeamSection = () => (
  <section id="author" className="py-24 md:py-32 bg-cream">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-sm tracking-widest uppercase text-gold-muted font-medium mb-3">The Author</p>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy mb-6">Greg Kang</h2>
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground">Investment research and portfolio management experience across New Zealand and Korea, combining fundamental analysis with quantitative and factor research.</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
        <aside className="space-y-8">
          <div><h3 className="font-heading text-xl text-navy mb-3">Education</h3><p className="font-medium text-navy mb-3">University of Auckland</p><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground"><li>Bachelor of Commerce with Honours — Economics</li><li>Graduate Diploma in Commerce — Economics</li><li>Bachelor of Commerce — Finance and Information Systems</li></ul></div>
          <div><h3 className="font-heading text-xl text-navy mb-3">Qualifications</h3><ul className="space-y-3 text-sm text-muted-foreground"><li>Financial Risk Manager (FRM)</li><li>Certified Investment Manager Program (Korea)</li></ul></div>
          <div><h3 className="font-heading text-xl text-navy mb-3">Research toolkit</h3><p className="text-sm leading-relaxed text-muted-foreground">Python · SQL · Bloomberg · BQNT</p><p className="text-sm text-muted-foreground mt-3">Languages: English & Korean</p></div>
        </aside>
        <div><h3 className="font-heading text-xl text-navy mb-8">Professional experience</h3><ol className="border-l border-gold-muted/40 ml-2 space-y-10">{experience.map((job) => <li key={job.firm} className="relative pl-7"><span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold-muted" /><p className="text-xs uppercase tracking-wider text-gold-muted mb-2">{job.dates}</p><h4 className="font-heading text-xl text-navy mb-1">{job.firm}</h4><p className="font-medium text-sm text-navy mb-1">{job.title}</p><p className="text-xs text-muted-foreground mb-3">{job.location}</p><p className="text-sm leading-relaxed text-muted-foreground">{job.detail}</p></li>)}</ol></div>
      </div>
    </div>
  </section>
);
export default TeamSection;
