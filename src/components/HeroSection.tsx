import logoIcon from "@/assets/axis11-icon.png";

const HeroSection = () => (
  <header className="bg-navy-dark pt-28 pb-9 md:pt-28 md:pb-10 text-primary-foreground">
    <div className="mx-auto max-w-6xl px-6 flex items-center gap-5 md:gap-7">
      <img src={logoIcon} alt="" className="h-14 w-14 md:h-20 md:w-20 object-contain brightness-0 invert shrink-0" />
      <div>
        <h1 className="font-sans text-xl md:text-3xl font-medium tracking-[0.12em]">AXIS11 RESEARCH</h1>
        <p className="mt-3 text-sm md:text-base text-primary-foreground/70">Independent research. A deeper perspective on markets.</p>
      </div>
    </div>
  </header>
);
export default HeroSection;
