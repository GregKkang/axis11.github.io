import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    document.title = "About | Axis11 Research";
    if (window.location.hash === "#author") document.getElementById("author")?.scrollIntoView();
  }, []);
  return <div className="min-h-screen bg-cream"><Navbar /><main className="pt-16"><AboutSection /><TeamSection /></main><Footer /></div>;
};
export default About;
