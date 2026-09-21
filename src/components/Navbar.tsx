import { useState } from "react";
import { Menu, X } from "lucide-react";

const home = import.meta.env.BASE_URL;
const linkStyle = "text-sm font-medium tracking-wider uppercase text-primary-foreground/70 hover:text-gold focus-visible:text-gold transition-colors";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-navy-light/30">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href={home} aria-label="Axis11 Research home" className="inline-flex items-baseline gap-2 text-primary-foreground">
          <span className="font-sans text-xl font-semibold leading-none tracking-wide [font-variant-numeric:lining-nums]">AXIS11</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {['Research', 'About', 'Author', 'Contact'].map(label => <a key={label} href={`${home}#${label.toLowerCase()}`} className={linkStyle}>{label}</a>)}
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground p-2" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div id="mobile-navigation" className="md:hidden max-h-[80vh] overflow-y-auto bg-navy-dark border-t border-navy-light/20 px-6 py-4 space-y-4">
        {['Research', 'About', 'Author', 'Contact'].map(label => <a key={label} href={`${home}#${label.toLowerCase()}`} className={`block ${linkStyle}`} onClick={() => setOpen(false)}>{label}</a>)}
      </div>}
    </nav>
  );
};
export default Navbar;
