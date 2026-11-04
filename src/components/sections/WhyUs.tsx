import { useRef } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { media } from "@/content/site"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { useScrollReveal, useStaggerReveal } from "@/hooks"

const points = [
  {
    title: "Trasparenza prima di tutto",
    text: "Nessun intervento senza il tuo consenso.",
  },
  {
    title: "Competenza multimarche",
    text: "Esperienza su auto, moto e scooter.",
  },
  {
    title: "Tempi rispettati",
    text: "Organizzazione e comunicazione puntuale.",
  },
]

export function WhyUs() {
  const imageRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLElement>(null)

  useScrollReveal({ ref: imageRef, fromY: 40, duration: 0.6 })
  useScrollReveal({ ref: contentRef, fromY: 40, duration: 0.6 })
  useStaggerReveal({
    containerRef: listRef,
    selector: ".why-list > li",
    fromY: 30,
    duration: 0.5,
    stagger: 0.1,
  })

  return (
    <section className="why-us" aria-labelledby="why-title">
      <SectionReveal fromY={40} duration={0.6}>
        <div ref={imageRef as never} className="why-image">
          <img
            src={media.heroPoster}
            alt="Lavorazione professionale all’interno dell’officina"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1067"
          />
          <div className="experience-badge">
            <strong>100%</strong>
            <span>
              impegno
              <br />
              sul tuo mezzo
            </span>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal fromY={40} duration={0.6}>
        <div ref={contentRef as never} className="why-content">
          <Eyebrow>Perché sceglierci</Eyebrow>
          <h2 id="why-title">
            <span>Il lavoro ben fatto</span>
            <span className="title-line">non ha scorciatoie.</span>
          </h2>
          <p>
            Ogni intervento parte da un ascolto attento e da una diagnosi
            precisa. Ti spieghiamo cosa serve, perché serve e quanto costa.
          </p>

          <ul className="why-list" ref={listRef as never}>
            {points.map((point) => (
              <li key={point.title}>
                <span className="why-check" aria-hidden="true">
                  <Icon name="check" size={18} />
                </span>
                <span className="why-copy">
                  <strong>{point.title}</strong>
                  <small>{point.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>
    </section>
  )
}
