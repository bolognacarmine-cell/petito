import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { services } from "@/content/site"
import { useScrollReveal, useStaggerReveal, useScrollTilt3D } from "@/hooks"

export function Services() {
  const headingRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)
  const [litCard, setLitCard] = useState<number | null>(null)
  const litTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (litTimer.current !== null) window.clearTimeout(litTimer.current)
    },
    [],
  )

  const lightUp = (index: number) => {
    if (litTimer.current !== null) window.clearTimeout(litTimer.current)
    setLitCard(index)
    litTimer.current = window.setTimeout(() => {
      setLitCard(null)
      window.location.hash = "#contatti"
    }, 1100)
  }

  useScrollReveal({ ref: headingRef, fromY: 40, duration: 0.6 })
  useStaggerReveal({
    containerRef: gridRef,
    selector: ".service-card",
    fromY: 40,
    duration: 0.5,
    stagger: 0.1,
  })
  useScrollTilt3D({ ref: headingRef, maxAngle: 10, axis: "y" })
  useScrollTilt3D({ ref: gridRef, maxAngle: 8, axis: "both" })

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
        {services.map((service, index) => (
          <li
            className={`service-card${litCard === index ? " is-lit" : ""}`}
            key={service.title}
            style={
              {
                "--service-image": `url("${service.image}")`,
                "--service-image-mobile": `url("${service.imageMobile}")`,
              } as CSSProperties
            }
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                rotateX: -8,
                rotateY: 4,
                scale: 1.02,
                ease: "power2.out",
                duration: 0.3,
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                ease: "power2.in",
                duration: 0.3,
              })
            }}
          >
            <a
              className="service-card-link"
              href="#contatti"
              aria-label={`${service.title}: richiedi informazioni`}
              onClick={(event) => {
                event.preventDefault()
                lightUp(index)
              }}
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
