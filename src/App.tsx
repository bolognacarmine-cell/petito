import { Header } from "@/components/sections/Header"
import { Hero } from "@/components/sections/Hero"
import { Intro } from "@/components/sections/Intro"
import { Services } from "@/components/sections/Services"
import { WhyUs } from "@/components/sections/WhyUs"
import { Process } from "@/components/sections/Process"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import { WhatsAppFab } from "@/components/sections/WhatsAppFab"
import { MobileCallBar } from "@/components/sections/MobileCallBar"

export default function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenuto">
        Vai al contenuto principale
      </a>

      <Header />

      <main id="contenuto" tabIndex={-1}>
        <Hero />
        <Intro />
        <Services />
        <WhyUs />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
      <MobileCallBar />
    </div>
  )
}
