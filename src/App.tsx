import { useState, type ReactNode } from "react"

const heroImage =
  "https://images.unsplash.com/photo-1756575527484-2839c593ed84?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=1800"

type IconName = "arrow" | "car" | "check" | "clock" | "engine" | "location" | "mail" | "menu" | "motorcycle" | "phone" | "quote" | "shield" | "tool" | "whatsapp" | "x"

function Icon({ name, size = 24 }: { name: IconName size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    car: (
      <>
        <path d="m5 11 1.5-4.5h11L19 11" />
        <path d="M3 11h18v7H3z" />
        <path d="M5 18v2M19 18v2M7 14h.01M17 14h.01" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    engine: (
      <>
        <path d="M6 9h11l3 3v6H6z" />
        <path d="M8 9V6h5v3M3 11v5M20 13h2v3h-2M9 13h6" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    motorcycle: (
      <>
        <circle cx="5" cy="17" r="3" />
        <circle cx="19" cy="17" r="3" />
        <path d="M5 17h6l3-7h3l2 7M9 10h5M7 13l-2-3H3M16 7h3" />
      </>
    ),
    phone: (
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-1-2 2c-4-1.5-7.5-5-9-9l2-2Z" />
    ),
    quote: (
      <path d="M7 17H3v-4c0-4 2-6 6-7v2c-2 .6-3 1.7-3 3h3v6Zm10 0h-4v-4c0-4 2-6 6-7v2c-2 .6-3 1.7-3 3h3v6Z" />
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    tool: (
      <path d="M14 7a5 5 0 0 0-6.7 6.7L3 18l3 3 4.3-4.3A5 5 0 0 0 17 10l-3 3-3-3 3-3Z" />
    ),
    whatsapp: (
      <>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
        <path d="M9 8c.5 3 2 4.5 5 5" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}

const services = [
  {
    icon: "engine" as const,
    title: "Meccanica generale",
    text: "Diagnosi e riparazioni per motore, trasmissione, frizione e distribuzione.",
  },
  {
    icon: "car" as const,
    title: "Tagliando auto",
    text: "Manutenzione programmata nel rispetto delle specifiche della casa madre.",
  },
  {
    icon: "motorcycle" as const,
    title: "Assistenza moto",
    text: "Tagliandi, freni, trasmissione e messa a punto per scooter e motocicli.",
  },
  {
    icon: "tool" as const,
    title: "Freni e sospensioni",
    text: "Controllo e sostituzione di dischi, pastiglie, ammortizzatori e componenti.",
  },
  {
    icon: "shield" as const,
    title: "Diagnosi elettronica",
    text: "Strumentazione professionale per individuare guasti e anomalie con precisione.",
  },
  {
    icon: "clock" as const,
    title: "Controlli stagionali",
    text: "Check-up completi prima di un viaggio o al cambio di stagione.",
  },
]

const faqs = [
  [
    "È necessario prenotare?",
    "La prenotazione è consigliata per garantirti tempi rapidi. Puoi contattarci telefonicamente o tramite WhatsApp.",
  ],
  [
    "Lavorate sia su auto che su moto?",
    "Sì, l’officina offre manutenzione e assistenza meccanica per automobili, moto e scooter.",
  ],
  [
    "Fornite un preventivo prima dei lavori?",
    "Sì. Dopo la diagnosi ti spieghiamo l’intervento necessario e condividiamo il preventivo prima di procedere.",
  ],
  [
    "Dove si trova l’officina?",
    "Siamo in Via 4 Novembre, 9, 81025 Marcianise (CE). Puoi aprire le indicazioni direttamente dalla sezione contatti.",
  ],
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          aria-label="Officina Marcianise - Home"
          onClick={closeMenu}
        >
          <img
            className="brand-logo"
            src="/petito-car-service-logo.jpg"
            alt=""
          />
          <span>
            <strong>PETITO CAR</strong>
            <small>SERVICE SRLS</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>

        <nav
          className={menuOpen ? "nav-links is-open" : "nav-links"}
          aria-label="Navigazione principale"
        >
          <a href="#servizi" onClick={closeMenu}>
            Servizi
          </a>
          <a href="#officina" onClick={closeMenu}>
            L’officina
          </a>
          <a href="#recensioni" onClick={closeMenu}>
            Recensioni
          </a>
          <a href="#contatti" onClick={closeMenu}>
            Contatti
          </a>
        </nav>

        <a className="header-phone" href="tel:+393791420274">
          <span>
            <Icon name="phone" size={20} />
          </span>
          <span>
            <small>Chiama ora</small>
            <strong>379 142 0274</strong>
          </span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <img
            className="hero-image"
            src={heroImage}
            alt="Meccanico al lavoro in un’officina automobilistica"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow">
              <span /> Meccatronica · Marcianise
            </div>
            <h1>
              La tua strada,
              <br />
              <em>la nostra cura.</em>
            </h1>
            <p>
              Riparazione e manutenzione meccanica, elettrica ed elettronica di
              autoveicoli. Competenza e trasparenza per ogni intervento.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contatti">
                Prenota un controllo <Icon name="arrow" size={19} />
              </a>
              <a className="button ghost" href="#servizi">
                Scopri i servizi
              </a>
            </div>
            <div className="hero-trust">
              <span>
                <Icon name="check" size={17} /> Preventivi chiari
              </span>
              <span>
                <Icon name="check" size={17} /> Ricambi di qualità
              </span>
              <span>
                <Icon name="check" size={17} /> Auto e moto
              </span>
            </div>
          </div>
          <aside className="hero-card">
            <span className="hero-card-icon">
              <Icon name="clock" size={29} />
            </span>
            <div>
              <small>Hai bisogno di assistenza?</small>
              <strong>Parla con un meccanico</strong>
            </div>
            <a href="#contatti" aria-label="Vai ai contatti">
              <Icon name="arrow" size={22} />
            </a>
          </aside>
        </section>

        <section className="intro" id="officina">
          <div className="section-label">La nostra officina</div>
          <div>
            <h2>
              Esperienza che si sente
              <br />a ogni chilometro.
            </h2>
          </div>
          <div className="intro-copy">
            <p className="intro-story">
              Angelo “Rob” “Nott” Petito e Tommaso: due generazioni, un’unica
              passione per la meccanica.
            </p>
            <p>
              Petito Car Service è un’officina meccatronica di Marcianise. Ci
              prendiamo cura del tuo veicolo con metodo, strumenti professionali
              e attenzione per ogni dettaglio.
            </p>
            <a className="text-link" href="#contatti">
              Conosciamoci <Icon name="arrow" size={18} />
            </a>
          </div>
        </section>

        <section className="services" id="servizi">
          <div className="section-heading">
            <div>
              <div className="section-label light">Cosa facciamo</div>
              <h2>
                Servizi completi.
                <br />
                <span>Soluzioni concrete.</span>
              </h2>
            </div>
            <p>
              Un unico punto di riferimento a Marcianise per la manutenzione e
              la riparazione di auto, moto e scooter.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span className="service-index">0{index + 1}</span>
                <span className="service-icon">
                  <Icon name={service.icon} size={30} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a
                  href="#contatti"
                  aria-label={`Richiedi informazioni su ${service.title}`}
                >
                  <Icon name="arrow" size={20} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="why-us">
          <div className="why-image">
            <img
              src={heroImage}
              alt="Lavorazione professionale all’interno dell’officina"
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
            <div className="section-label">Perché sceglierci</div>
            <h2>
              Il lavoro ben fatto
              <br />
              non ha scorciatoie.
            </h2>
            <p>
              Ogni intervento parte da un ascolto attento e da una diagnosi
              precisa. Ti spieghiamo cosa serve, perché serve e quanto costa.
            </p>
            <ul>
              <li>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <strong>Trasparenza prima di tutto</strong>
                  <small>Nessun intervento senza il tuo consenso.</small>
                </div>
              </li>
              <li>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <strong>Competenza multimarche</strong>
                  <small>Esperienza su auto, moto e scooter.</small>
                </div>
              </li>
              <li>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <strong>Tempi rispettati</strong>
                  <small>Organizzazione e comunicazione puntuale.</small>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="process">
          <div className="section-label">Come lavoriamo</div>
          <h2>
            Semplice, chiaro,
            <br />
            senza sorprese.
          </h2>
          <div className="process-grid">
            {[
              [
                "01",
                "Contattaci",
                "Descrivici il problema e concordiamo il momento migliore.",
              ],
              [
                "02",
                "Diagnosi",
                "Controlliamo il veicolo e individuiamo con precisione la causa.",
              ],
              [
                "03",
                "Preventivo",
                "Ti spieghiamo l’intervento e condividiamo costi e tempi.",
              ],
              [
                "04",
                "Riparti",
                "Eseguiamo il lavoro e riconsegniamo il mezzo pronto per la strada.",
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials" id="recensioni">
          <div className="section-heading dark-text">
            <div>
              <div className="section-label">Dicono di noi</div>
              <h2>
                La fiducia si costruisce
                <br />
                <span>un intervento alla volta.</span>
              </h2>
            </div>
            <p>
              Testi dimostrativi da sostituire con recensioni reali dei tuoi
              clienti.
            </p>
          </div>
          <div className="review-grid">
            {[
              [
                "Serietà e chiarezza",
                "“Mi hanno spiegato il problema prima di procedere. Lavoro preciso e tempi rispettati.”",
                "Cliente auto",
              ],
              [
                "Un punto di riferimento",
                "“Porto qui sia l’auto che lo scooter. Disponibili, competenti e sempre trasparenti.”",
                "Cliente auto e moto",
              ],
              [
                "Consigliatissimi",
                "“Diagnosi veloce e problema risolto. Ho apprezzato molto la cura e la professionalità.”",
                "Cliente locale",
              ],
            ].map(([title, text, author]) => (
              <article className="review-card" key={title}>
                <Icon name="quote" size={31} />
                <div className="stars">★★★★★</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>{author}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="faq">
          <div>
            <div className="section-label">Domande frequenti</div>
            <h2>
              Prima di
              <br />
              venire in officina.
            </h2>
            <p>Non trovi la risposta che cerchi?</p>
            <a className="text-link" href="#contatti">
              Contattaci direttamente <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article
                className={openFaq === index ? "faq-item open" : "faq-item"}
                key={question}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{question}</span>
                  <strong>{openFaq === index ? "−" : "+"}</strong>
                </button>
                <div>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contatti">
          <div className="contact-copy">
            <div className="section-label light">Contatti</div>
            <h2>
              Il tuo veicolo
              <br />
              merita attenzione.
            </h2>
            <p>
              Chiamaci o scrivici su WhatsApp per informazioni, un preventivo o
              per fissare un controllo.
            </p>
            <div className="contact-actions">
              <a className="button primary" href="tel:+390823830658">
                <Icon name="phone" size={20} /> Chiama l’officina
              </a>
              <a
                className="button whatsapp"
                href="https://wa.me/393791420274"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={20} /> Scrivi su WhatsApp
              </a>
            </div>
          </div>
          <div className="contact-details">
            <article>
              <span>
                <Icon name="location" />
              </span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Via+4+Novembre+9+81025+Marcianise+CE"
                target="_blank"
                rel="noreferrer"
              >
                <small>Dove siamo</small>
                <strong>
                  Via 4 Novembre, 9
                  <br />
                  81025 Marcianise (CE)
                </strong>
              </a>
            </article>
            <article>
              <span>
                <Icon name="clock" />
              </span>
              <div>
                <small>Orari di apertura</small>
                <strong>
                  Lun–Ven: 08:00–13:00
                  <br />
                  14:00–18:30
                  <br />
                  Sab–Dom: chiuso
                </strong>
              </div>
            </article>
            <article>
              <span>
                <Icon name="phone" />
              </span>
              <div>
                <small>Telefono e cellulare</small>
                <strong>
                  <a href="tel:+390823830658">0823 830658</a>
                  <br />
                  <a href="tel:+393791420274">379 142 0274</a>
                </strong>
              </div>
            </article>
            <article>
              <span>
                <Icon name="mail" />
              </span>
              <div>
                <small>Email</small>
                <strong>
                  <a href="mailto:petitocarservice@libero.it">
                    petitocarservice@libero.it
                  </a>
                </strong>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home">
          <img
            className="brand-logo"
            src="/petito-car-service-logo.jpg"
            alt=""
          />
          <span>
            <strong>PETITO CAR</strong>
            <small>SERVICE SRLS</small>
          </span>
        </a>
        <p>Assistenza meccanica per auto e moto a Marcianise.</p>
        <div>
          <a href="#servizi">Servizi</a>
          <a href="#officina">L’officina</a>
          <a href="#contatti">Contatti</a>
        </div>
        <small>
          © {new Date().getFullYear()} Petito Car Service S.R.L.S. · P. IVA/C.F.
          04874900618 · REA CE-362485 · Tutti i diritti riservati.
        </small>
      </footer>

      <a
        className="floating-whatsapp"
        href="https://wa.me/393791420274"
        target="_blank"
        rel="noreferrer"
        aria-label="Contattaci su WhatsApp"
      >
        <Icon name="whatsapp" size={25} />
      </a>
    </div>
  )
}
