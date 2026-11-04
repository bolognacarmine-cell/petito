import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { media } from "@/content/site"

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
  return (
    <section className="why-us" aria-labelledby="why-title">
      <div className="why-image">
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

      <div className="why-content">
        <Eyebrow>Perché sceglierci</Eyebrow>
        <h2 id="why-title">
          <span>Il lavoro ben fatto</span>
          <span className="title-line">non ha scorciatoie.</span>
        </h2>
        <p>
          Ogni intervento parte da un ascolto attento e da una diagnosi precisa.
          Ti spieghiamo cosa serve, perché serve e quanto costa.
        </p>

        <ul className="why-list">
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
    </section>
  )
}
