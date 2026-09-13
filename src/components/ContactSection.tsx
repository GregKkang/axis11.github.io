import { Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-navy-dark">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-gold font-medium mb-3">Get in Touch</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">
            Get in Touch
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-primary-foreground/60">
            Questions about a research topic, feedback on a market view, or an idea for future commentary?
            Get in touch with Greg by email.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border border-navy-light rounded-lg p-5 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 rounded-md bg-navy flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-primary-foreground/50 mb-1">Email</p>
              <a href="mailto:greg.kkang@gmail.com" className="text-primary-foreground hover:text-gold transition-colors">
                greg.kkang@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-navy-light rounded-lg p-5 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 rounded-md bg-navy flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-primary-foreground/50 mb-1">Location</p>
              <p className="text-primary-foreground">New Zealand</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="mailto:greg.kkang@gmail.com"
            className="inline-block bg-gold text-accent-foreground px-10 py-3 text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-gold-light transition-colors duration-300"
          >
            Email Greg
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
