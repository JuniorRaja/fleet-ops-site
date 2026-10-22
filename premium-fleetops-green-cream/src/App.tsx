import { MotionProvider } from "./lib/motion";
import { Cursor } from "./components/Cursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { Features } from "./components/Features";
import { ComplianceMatrix } from "./components/demos/ComplianceMatrix";
import { VehicleCheck } from "./components/demos/VehicleCheck";
import { OneSaveTrip } from "./components/demos/OneSaveTrip";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <MotionProvider>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <div id="demos">
          <ComplianceMatrix />
          <VehicleCheck />
          <OneSaveTrip />
        </div>
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </MotionProvider>
  );
}
