import { 
  Navbar, 
  Hero, 
  HowItWorks, 
  Features, 
  Readiness, 
  Testimonials, 
  CTA, 
  Footer 
} from "@/components/landing";
  
export default function Home() { 
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Readiness />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}