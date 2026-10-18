import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ResearchLibrary from "@/components/ResearchLibrary";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (["about", "author", "contact"].includes(id)) {
      window.location.replace(`${import.meta.env.BASE_URL}${id === "contact" ? "contact/" : `about/${id === "author" ? "#author" : ""}`}`);
      return;
    }
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ResearchLibrary />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
