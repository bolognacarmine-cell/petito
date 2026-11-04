import type { CSSProperties } from "react"
import { useRef } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { services } from "@/content/site"
import { useScrollReveal, useStaggerReveal } from "@/hooks"

export function Services() {
  const headingRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)

  useScrollReveal({ ref: headingRef, fromY: 40, duration: 0.6 })
  useStaggerReveal({
    containerRef: gridRef,
    selector: ".service-card",
    fromY: 40,
    duration: 0.5,
    stagger: 0.1,
  })

  return (
    <section className="services" id="servizi" aria-labelledby="services-title">
      <div className="section-heading">
        <SectionReveal fromY={40} duration={0.6}>
          <div ref={headingRef as never}>
            <Eyebrow tone="on-dark">Cosa facciamo</Eyebrow>
            <h2 className="section-title" id="services-title">
              <span>Servizi completi.</span>
              <span className="title-line">Soluzioni concrete.</span>
            </h2>
            <p className="section-intro">
              Un unico punto di riferimento a Marcianise per la manutenzione e
              la riparazione di auto, moto e scooter.
            </p>
          </div>
        </SectionReveal>
      </div>

      <ul className="services-grid" ref={gridRef as never}>
        {services.map((service) => (
          <li
            className="service-card"
            key={service.title}
            style={
              {
                "--service-image": `url("${service.image}")`,
                "--service-image-mobile": `url("${service.imageMobile}")`,
              } as CSSProperties
            }
          >
            <a
              className="service-card-link"
              href="#contatti"
              aria-label={`${service.title}: richiedi informazioni`}
            >
              <span className="service-icon" aria-hidden="true">
                <Icon name={service.icon} size={28} />
              </span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-text">{service.text}</p>
              <span className="service-cta" aria-hidden="true">
                <Icon name="arrow" size={20} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
