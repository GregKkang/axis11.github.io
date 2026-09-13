import logo from "@/assets/axis11-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-navy-dark/60" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <img
            src={logo}
            alt="Axis11 Capital"
            width={320}
            height={320}
            className="mx-auto mb-8 w-48 md:w-64 drop-shadow-2xl brightness-0 invert"
          />
        </div>

        <p className="animate-fade-in-up-delay-1 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed text-primary-foreground/80">
          Systematic. Disciplined. Data-Driven.
        </p>

        <div className="animate-fade-in-up-delay-2 mt-3">
          <p className="text-sm md:text-base tracking-widest uppercase text-gold font-medium">
            Investment Research & Market Commentary
          </p>
        </div>

        <div className="animate-fade-in-up-delay-2 mt-10">
          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-gold/50 text-gold px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold/10 transition-all duration-300 rounded-sm"
          >
            Learn More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
