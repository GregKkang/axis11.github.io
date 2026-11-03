import logoIcon from "@/assets/axis11-icon.png";

const HeroSection = () => (
  <header className="bg-navy-dark pt-28 pb-9 md:pt-28 md:pb-10 text-primary-foreground">
    <div className="mx-auto max-w-6xl px-6">
      <div className="relative sm:ml-44">
        {/* Crop the transparent padding so the visible mark matches the text block. */}
        <svg
          viewBox="212 315 601 394"
          aria-hidden="true"
          className="mb-5 h-16 w-auto overflow-hidden brightness-0 invert sm:absolute sm:right-[calc(100%+2rem)] sm:top-0 sm:mb-0 sm:h-full"
        >
          <image href={logoIcon} width="1024" height="1024" />
        </svg>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-tight">AXIS11 Research</h1>
        <p className="mt-3 text-sm md:text-base leading-6 text-primary-foreground/70">Independent research. A deeper perspective on markets.</p>
      </div>
    </div>
  </header>
);
export default HeroSection;
