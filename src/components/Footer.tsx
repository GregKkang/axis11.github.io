import logoIcon from "@/assets/axis11-icon.png";

const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-navy-light/20 py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Axis11" className="h-6 w-6 brightness-0 invert opacity-60" />
            <span className="text-xs tracking-widest uppercase text-primary-foreground/40">
              Axis11 Capital Limited
            </span>
          </div>
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Axis11 Capital Limited. All rights reserved.
          </p>
        </div>
        <p className="text-center text-[10px] text-primary-foreground/20 mt-6 max-w-3xl mx-auto leading-relaxed">
          This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer 
          to buy any securities. Past performance is not indicative of future results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
