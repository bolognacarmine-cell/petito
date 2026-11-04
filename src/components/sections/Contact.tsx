import { Icon } from "@/components/Icon"
import { ActionLink } from "@/components/ui/ActionLink"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { contact } from "@/content/site"

export function Contact() {
  return (
    <section className="contact" id="contatti" aria-labelledby="contact-title">
      <div className="contact-copy">
        <Eyebrow tone="on-dark">Contatti</Eyebrow>
        <h2 id="contact-title">
          <span>Il tuo veicolo</span>
          <span className="title-line">merita attenzione.</span>
        </h2>
        <p>
          Chiamaci o scrivici su WhatsApp per informazioni, un preventivo o per
          fissare un controllo.
        </p>

        <div className="contact-actions">
          <ActionLink href={contact.phone.href} icon="phone">
            Chiama l’officina
          </ActionLink>
          <ActionLink
            href={contact.whatsappUrl}
            variant="whatsapp"
            icon="whatsapp"
            external
          >
            Scrivi su WhatsApp
          </ActionLink>
        </div>
      </div>

      <div className="contact-details">
        <div className="contact-item">
          <span className="contact-icon" aria-hidden="true">
            <Icon name="location" />
          </span>
          <div className="contact-item-body">
            <p className="contact-label">Dove siamo</p>
            <address className="contact-value">
              <a href={contact.address.mapsUrl} target="_blank" rel="noreferrer">
                {contact.address.street}
                <br />
                {contact.address.city}
                <span className="visually-hidden">
                  {" "}
                  (apri la mappa in una nuova scheda)
                </span>
              </a>
            </address>
          </div>
        </div>

        <div className="contact-item">
          <span className="contact-icon" aria-hidden="true">
            <Icon name="clock" />
          </span>
          <div className="contact-item-body">
            <p className="contact-label">Orari di apertura</p>
            <dl className="contact-hours">
              {contact.hours.map((row) => (
                <div key={row.days}>
                  <dt>{row.days}</dt>
                  <dd>{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="contact-item">
          <span className="contact-icon" aria-hidden="true">
            <Icon name="phone" />
          </span>
          <div className="contact-item-body">
            <p className="contact-label">Telefono e cellulare</p>
            <p className="contact-value">
              <a href={contact.phone.href}>{contact.phone.label}</a>
              <br />
              <a href={contact.mobile.href}>{contact.mobile.label}</a>
            </p>
          </div>
        </div>

        <div className="contact-item">
          <span className="contact-icon" aria-hidden="true">
            <Icon name="mail" />
          </span>
          <div className="contact-item-body">
            <p className="contact-label">Email</p>
            <p className="contact-value">
              <a href={contact.email.href}>{contact.email.label}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
