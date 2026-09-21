import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import categories from "@/data/research.json";

const home = import.meta.env.BASE_URL;
const linkStyle = "text-sm font-medium tracking-wider uppercase text-primary-foreground/70 hover:text-gold focus-visible:text-gold transition-colors";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-navy-light/30">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href={home} aria-label="Axis11 Research home" className="inline-flex items-baseline gap-2 text-primary-foreground">
          <span className="font-sans text-xl font-semibold leading-none tracking-wide [font-variant-numeric:lining-nums]">AXIS11</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href={`${home}#about`} className={linkStyle}>About</a>
          <div className="relative" onMouseEnter={() => setResearchOpen(true)} onMouseLeave={() => setResearchOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setResearchOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") setResearchOpen(false); }}>
            <div className="flex items-center gap-1">
              <a href={`${home}#research`} className={linkStyle} onFocus={() => setResearchOpen(true)}>Research</a>
              <button type="button" aria-label="Toggle research categories" aria-expanded={researchOpen} aria-controls="research-dropdown" onClick={() => setResearchOpen(!researchOpen)} className="p-1 text-primary-foreground/70 hover:text-gold"><ChevronDown className="h-4 w-4" /></button>
            </div>
            {researchOpen && <div id="research-dropdown" className="absolute left-0 top-full pt-3 w-64"><div className="rounded-md border border-navy-light bg-navy-dark p-2 shadow-xl">
              {categories.map((category) => <a key={category.slug} href={`${home}?category=${category.slug}#research`} className="block rounded px-4 py-3 text-sm text-primary-foreground/80 hover:bg-navy-light focus-visible:bg-navy-light hover:text-gold">{category.title}</a>)}
            </div></div>}
          </div>
          <a href={`${home}#author`} className={linkStyle}>Author</a>
          <a href={`${home}#contact`} className={linkStyle}>Contact</a>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground p-2" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div id="mobile-navigation" className="md:hidden max-h-[80vh] overflow-y-auto bg-navy-dark border-t border-navy-light/20 px-6 py-4 space-y-4">
        <a href={`${home}#about`} className={`block ${linkStyle}`} onClick={() => setOpen(false)}>About</a>
        <a href={`${home}#research`} className={`block ${linkStyle}`} onClick={() => setOpen(false)}>Research</a>
        <div className="border-l border-gold/40 pl-4 space-y-3">{categories.map((category) => <a key={category.slug} href={`${home}?category=${category.slug}#research`} className="block text-sm text-primary-foreground/80 hover:text-gold" onClick={() => setOpen(false)}>{category.title}</a>)}</div>
        <a href={`${home}#author`} className={`block ${linkStyle}`} onClick={() => setOpen(false)}>Author</a>
        <a href={`${home}#contact`} className={`block ${linkStyle}`} onClick={() => setOpen(false)}>Contact</a>
      </div>}
    </nav>
  );
};
export default Navbar;
