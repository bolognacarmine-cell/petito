import { useRef, useState } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { media } from "@/content/site"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { useScrollReveal, useStaggerReveal, useScrollTilt3D } from "@/hooks"

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
  const [lit, setLit] = useState(false)

  const toggleLights = () => setLit((value) => !value)

  useScrollReveal({ ref: imageRef, fromY: 40, duration: 0.6 })
  useScrollReveal({ ref: contentRef, fromY: 40, duration: 0.6 })
  useScrollTilt3D({ ref: imageRef, maxAngle: 12, axis: "y" })
  useScrollTilt3D({ ref: contentRef, maxAngle: 8, axis: "both" })
  useStaggerReveal({
    containerRef: listRef,
    selector: ".why-list > li",
    fromY: 30,
    duration: 0.5,
    stagger: 0.1,
  })

  return (
    <section
      className={`why-us${lit ? " is-lit" : ""}`}
      aria-labelledby="why-title"
    >
      <SectionReveal fromY={40} duration={0.6}>
        <div
          ref={imageRef as never}
          className={`why-image${lit ? " is-lit" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={lit}
          aria-label={
            lit ? "Spegni le luci delle auto" : "Accendi le luci delle auto"
          }
          onClick={toggleLights}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              toggleLights()
            }
          }}
        >
          <img
            src={media.heroPoster}
            alt="Lavorazione professionale all’interno dell’officina"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1067"
          />
          <svg
            className="why-headlights"
            viewBox="0 0 1600 1067"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <radialGradient id="why-lamp-glow">
                <stop offset="0%" stopColor="#fff9e8" stopOpacity="1" />
                <stop offset="18%" stopColor="#ffe9b8" stopOpacity="0.92" />
                <stop offset="42%" stopColor="#ffc873" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#ff9d3c" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#ff9d3c" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="why-pool-glow">
                <stop offset="0%" stopColor="#ffe2ad" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#ffca80" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#ffca80" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g className="why-headlights__pools">
              <ellipse
                cx="340"
                cy="905"
                rx="210"
                ry="58"
                fill="url(#why-pool-glow)"
              />
            </g>

            <g className="why-headlights__lamps">
              <circle
                className="why-headlight"
                cx="222"
                cy="710"
                r="44"
                fill="url(#why-lamp-glow)"
              />
              <circle
                className="why-headlight"
                cx="492"
                cy="703"
                r="40"
                fill="url(#why-lamp-glow)"
              />
            </g>
          </svg>

          <span className="why-lights-hint" aria-hidden="true">
            <span className="why-lights-hint__dot" />
            {lit ? "Spegni le luci" : "Accendi le luci"}
          </span>
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
