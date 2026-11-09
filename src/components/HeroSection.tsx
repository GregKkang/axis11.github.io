import logoIcon from "@/assets/axis11-icon.png";

const HeroSection = () => (
  <header className="bg-navy-dark pt-28 pb-9 md:pt-28 md:pb-10 text-primary-foreground">
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
        {/* Trim transparent padding; keep the mark subordinate to the title. */}
        <svg
          viewBox="212 315 601 394"
          aria-hidden="true"
          className="h-10 w-[61px] shrink-0 overflow-hidden brightness-0 invert sm:h-12 sm:w-[73px] md:h-14 md:w-[85px]"
        >
          <image href={logoIcon} width="1024" height="1024" />
        </svg>
        <div className="min-w-0">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-tight [font-variant-numeric:lining-nums]">AXIS11 Research</h1>
          <p className="mt-3 text-sm md:text-base leading-6 text-primary-foreground/70">Independent research. A deeper perspective on markets.</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-primary-foreground/60 sm:ml-[97px] md:ml-[113px]">
        Get new research by email.{" "}
        <a
          href="#subscribe"
          className="ml-1 inline-block font-medium text-gold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          onClick={(event) => {
            const target = document.getElementById("subscribe");
            if (!target) return;
            event.preventDefault();
            window.history.pushState(null, "", "#subscribe");
            target.focus({ preventScroll: true });
            target.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              block: "start",
            });
          }}
        >
          Subscribe <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  </header>
);
export default HeroSection;
