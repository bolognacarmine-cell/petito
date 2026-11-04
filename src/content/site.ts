export type IconName =
  | "arrow"
  | "car"
  | "check"
  | "clock"
  | "engine"
  | "location"
  | "mail"
  | "menu"
  | "motorcycle"
  | "phone"
  | "quote"
  | "shield"
  | "tool"
  | "whatsapp"
  | "x"

export type Service = {
  icon: IconName
  title: string
  text: string
  image?: string
  imageMobile?: string
}

export type Faq = {
  question: string
  answer: string
}

export type ProcessStep = {
  number: string
  title: string
  text: string
}

export type Review = {
  title: string
  quote: string
  author: string
}

const asset = (path: string) =>
  new URL(`${import.meta.env.BASE_URL}${path}`, document.baseURI).href

export const media = {
  logo: asset("petito-car-service-logo.webp"),
  heroPoster: asset("hero-petito-car-service-poster.webp"),
  heroVideo: asset("hero-petito-car-service.mp4"),
}

const serviceImage = (index: number) =>
  asset(`assets/images/services/service-${index}.webp`)
const serviceImageMobile = (index: number) =>
  asset(`assets/images/services/service-${index}-mobile.webp`)

export const services: Service[] = [
  {
    icon: "car",
    title: "Manutenzione generale",
    text: "Interventi completi di manutenzione ordinaria e straordinaria per auto, moto e scooter.",
    image: serviceImage(7),
    imageMobile: serviceImageMobile(7),
  },
  {
    icon: "car",
    title: "Tagliando auto",
    text: "Manutenzione programmata nel rispetto delle specifiche della casa madre.",
    image: serviceImage(8),
    imageMobile: serviceImageMobile(8),
  },
  {
    icon: "motorcycle",
    title: "Assistenza moto",
    text: "Tagliandi, freni, trasmissione e messa a punto per scooter e motocicli.",
    image: serviceImage(9),
    imageMobile: serviceImageMobile(9),
  },
  {
    icon: "tool",
    title: "Freni e sospensioni",
    text: "Controllo e sostituzione di dischi, pastiglie, ammortizzatori e componenti.",
    image: serviceImage(10),
    imageMobile: serviceImageMobile(10),
  },
  {
    icon: "shield",
    title: "Diagnosi elettronica",
    text: "Strumentazione professionale per individuare guasti e anomalie con precisione.",
    image: serviceImage(5),
    imageMobile: serviceImageMobile(5),
  },
  {
    icon: "clock",
    title: "Controlli stagionali",
    text: "Check-up completi prima di un viaggio o al cambio di stagione.",
    image: serviceImage(11),
    imageMobile: serviceImageMobile(11),
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Contattaci",
    text: "Descrivici il problema e concordiamo il momento migliore.",
  },
  {
    number: "02",
    title: "Diagnosi",
    text: "Controlliamo il veicolo e individuiamo con precisione la causa.",
  },
  {
    number: "03",
    title: "Preventivo",
    text: "Ti spieghiamo l’intervento e condividiamo costi e tempi.",
  },
  {
    number: "04",
    title: "Riparti",
    text: "Eseguiamo il lavoro e riconsegniamo il mezzo pronto per la strada.",
  },
]

export const reviews: Review[] = [
  {
    title: "Serietà e chiarezza",
    quote:
      "“Mi hanno spiegato il problema prima di procedere. Lavoro preciso e tempi rispettati.”",
    author: "Cliente auto",
  },
  {
    title: "Un punto di riferimento",
    quote:
      "“Porto qui sia l’auto che lo scooter. Disponibili, competenti e sempre trasparenti.”",
    author: "Cliente auto e moto",
  },
  {
    title: "Consigliatissimi",
    quote:
      "“Diagnosi veloce e problema risolto. Ho apprezzato molto la cura e la professionalità.”",
    author: "Cliente locale",
  },
]

export const faqs: Faq[] = [
  {
    question: "È necessario prenotare?",
    answer:
      "La prenotazione è consigliata per garantirti tempi rapidi. Puoi contattarci telefonicamente o tramite WhatsApp.",
  },
  {
    question: "Lavorate sia su auto che su moto?",
    answer:
      "Sì, l’officina offre manutenzione e assistenza meccanica per automobili, moto e scooter.",
  },
  {
    question: "Fornite un preventivo prima dei lavori?",
    answer:
      "Sì. Dopo la diagnosi ti spieghiamo l’intervento necessario e condividiamo il preventivo prima di procedere.",
  },
  {
    question: "Dove si trova l’officina?",
    answer:
      "Siamo in Via 4 Novembre, 9, 81025 Marcianise (CE). Puoi aprire le indicazioni direttamente dalla sezione contatti.",
  },
]

export const contact = {
  name: "Petito Car Service S.R.L.S.",
  address: {
    street: "Via 4 Novembre, 9",
    city: "81025 Marcianise (CE)",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Via+4+Novembre+9+81025+Marcianise+CE",
  },
  phone: { label: "0823 830658", href: "tel:+390823830658" },
  mobile: { label: "379 142 0274", href: "tel:+393791420274" },
  email: {
    label: "petitocarservice@libero.it",
    href: "mailto:petitocarservice@libero.it",
  },
  whatsappUrl: "https://wa.me/393791420274",
  hours: [
    { days: "Lun–Ven", time: "08:00–13:00 · 14:00–18:30" },
    { days: "Sab–Dom", time: "Chiuso" },
  ],
} as const

export const company = {
  name: "PETITO CAR SERVICE SOCIETÀ A RESPONSABILITÀ LIMITATA SEMPLIFICATA",
  vat: "04874900618",
  taxCode: "04874900618",
  vatEu: "IT04874900618",
  rea: "CE-362485",
  pec: "petitocarservicesrls@pec.it",
  registeredOffice: "Via Quattro Novembre 9, 81025 Marcianise (CE)",
} as const

export const navigation = [
  { href: "#servizi", label: "Servizi", id: "servizi" },
  { href: "#officina", label: "L’officina", id: "officina" },
  { href: "#recensioni", label: "Recensioni", id: "recensioni" },
  { href: "#contatti", label: "Contatti", id: "contatti" },
] as const
