import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  Navbar, 
  Hero, 
  HowItWorks, 
  Features, 
  Readiness, 
  Stats,
  Testimonials,
  CTA,
  Footer 
} from "@/components/landing";
  
export default async function Home() { 
  // Intercept authenticated users on the server layer
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Readiness />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}