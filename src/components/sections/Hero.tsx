import { useRef } from "react"
import { ActionLink } from "@/components/ui/ActionLink"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { Icon } from "@/components/Icon"
import { contact, media } from "@/content/site"
import { usePrefersReducedMotion } from "@/hooks/useUiPreferences"
import { useHeroEntrance } from "@/hooks/useHeroEntrance"

const trustPoints = ["Preventivi chiari", "Ricambi di qualità", "Auto e moto"]

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  const eyebrowRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLElement>(null)
  const leadRef = useRef<HTMLElement>(null)
  const actionsRef = useRef<HTMLElement>(null)
  const trustRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLElement>(null)

  useHeroEntrance({
    headlineRef,
    leadRef,
    actionsRef,
    trustRef,
    cardRef,
    eyebrowRef,
  })

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-media">
        {reducedMotion ? (
          <img
            className="hero-image"
            src={media.heroPoster}
            alt="Meccanico al lavoro in un’officina automobilistica"
            width="1600"
            height="1067"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <video
            className="hero-image"
            src={media.heroVideo}
            poster={media.heroPoster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <div ref={eyebrowRef as never}>
            <Eyebrow tone="on-dark">Meccatronica · Marcianise</Eyebrow>
          </div>
          <h1 className="hero-title" id="hero-title" ref={headlineRef as never}>
            <span>La tua strada,</span>
            <em>la nostra cura.</em>
          </h1>
          <p className="hero-lead" ref={leadRef as never}>
            Riparazione e manutenzione meccanica, elettrica ed elettronica di
            autoveicoli. Competenza e trasparenza per ogni intervento.
          </p>

          <div className="hero-actions" ref={actionsRef as never}>
            <ActionLink href="#contatti" icon="arrow">
              Prenota un controllo
            </ActionLink>
            <ActionLink href="#servizi" variant="ghost">
              Scopri i servizi
            </ActionLink>
          </div>

          <ul className="hero-trust" ref={trustRef as never}>
            {trustPoints.map((point) => (
              <li key={point}>
                <Icon name="check" size={17} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a className="hero-card" href={contact.phone.href} ref={cardRef as never}>
        <span className="hero-card-icon" aria-hidden="true">
          <Icon name="clock" size={26} />
        </span>
        <span className="hero-card-copy">
          <small>Hai bisogno di assistenza?</small>
          <strong>Parla con un meccanico</strong>
        </span>
        <span className="hero-card-arrow" aria-hidden="true">
          <Icon name="arrow" size={20} />
        </span>
      </a>
    </section>
  )
}
