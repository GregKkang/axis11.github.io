import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Contact = () => {
  useEffect(() => { document.title = "Contact | Axis11 Research"; }, []);
  return <div className="min-h-screen flex flex-col bg-navy-dark"><Navbar /><main className="pt-16 flex-1"><ContactSection /></main><Footer /></div>;
};
export default Contact;
