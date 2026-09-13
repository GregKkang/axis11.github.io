import logoIcon from "@/assets/axis11-icon.png";

const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-navy-light/20 py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Axis11" className="h-6 w-6 brightness-0 invert opacity-60" />
            <span className="text-xs tracking-widest uppercase text-primary-foreground/40">
              Axis11 Capital
            </span>
          </div>
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Axis11 Capital. All rights reserved.
          </p>
        </div>
        <p className="text-center text-xs text-primary-foreground/60 mt-6 max-w-3xl mx-auto leading-relaxed">
          Research and commentary are for general information and do not constitute personalised financial advice
          or an offer of investment products or services. Views may change as new information becomes available.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
