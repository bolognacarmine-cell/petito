import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"

export function Intro() {
  return (
    <section className="intro" id="officina" aria-labelledby="intro-title">
      <Eyebrow>La nostra officina</Eyebrow>

      <h2 className="intro-title" id="intro-title">
        <span>Esperienza che si sente</span>
        <span className="title-line">a ogni chilometro.</span>
      </h2>

      <div className="intro-copy">
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
    </section>
  )
}
