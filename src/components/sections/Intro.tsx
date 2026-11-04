import { useRef } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { useScrollReveal } from "@/hooks"

export function Intro() {
  const headingRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLElement>(null)

  useScrollReveal({ ref: headingRef, fromY: 40, duration: 0.6 })
  useScrollReveal({ ref: copyRef, fromY: 40, duration: 0.6 })

  return (
    <section className="intro" id="officina" aria-labelledby="intro-title">
      <SectionReveal fromY={40} duration={0.6}>
        <div ref={headingRef as never}>
          <Eyebrow>La nostra officina</Eyebrow>

          <h2 className="intro-title" id="intro-title">
            <span>Esperienza che si sente</span>
            <span className="title-line">a ogni chilometro.</span>
          </h2>
        </div>
      </SectionReveal>

      <SectionReveal fromY={40} duration={0.6}>
        <div ref={copyRef as never} className="intro-copy">
          <p className="intro-story">
            Angelo e Tommaso Petito: due generazioni, un’unica passione per la
            meccanica.
          </p>
          <p>
            Petito Car Service è un’officina meccatronica di Marcianise. Ci
            prendiamo cura del tuo veicolo con metodo, strumenti professionali e
            attenzione per ogni dettaglio.
          </p>
          <a className="text-link" href="#contatti">
            Conosciamoci <Icon name="arrow" size={18} />
          </a>
        </div>
      </SectionReveal>
    </section>
  )
}
