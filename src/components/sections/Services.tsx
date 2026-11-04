import type { CSSProperties } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { services } from "@/content/site"

export function Services() {
  return (
    <section className="services" id="servizi" aria-labelledby="services-title">
      <div className="section-heading">
        <div>
          <Eyebrow tone="on-dark">Cosa facciamo</Eyebrow>
          <h2 className="section-title" id="services-title">
            <span>Servizi completi.</span>
            <span className="title-line">Soluzioni concrete.</span>
          </h2>
        </div>
        <p className="section-intro">
          Un unico punto di riferimento a Marcianise per la manutenzione e la
          riparazione di auto, moto e scooter.
        </p>
      </div>

      <ul className="services-grid">
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
