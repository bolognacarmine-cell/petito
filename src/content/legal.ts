export type LegalInline = string | { text: string; href: string }

export type LegalBlock =
  | { kind: "p"; content: LegalInline[] }
  | { kind: "list"; items: LegalInline[][] }

export type LegalSection = {
  id: string
  title: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  id: "privacy" | "cookie"
  title: string
  updated: string
  sections: LegalSection[]
}

const p = (...content: LegalInline[]): LegalBlock => ({ kind: "p", content })
const list = (...items: LegalInline[][]): LegalBlock => ({ kind: "list", items })

const companyName =
  "PETITO CAR SERVICE SOCIETÀ A RESPONSABILITÀ LIMITATA SEMPLIFICATA"

export const privacyPolicy: LegalDocument = {
  id: "privacy",
  title: "Informativa privacy",
  updated: "4 novembre 2026",
  sections: [
    {
      id: "privacy-titolare",
      title: "Titolare del trattamento",
      blocks: [
        p(
          `Il Titolare del trattamento è ${companyName}, con sede legale in Via Quattro Novembre 9, 81025 Marcianise (CE), P. IVA e C.F. 04874900618, REA CE-362485, PEC `,
          { text: "petitocarservicesrls@pec.it", href: "mailto:petitocarservicesrls@pec.it" },
          ", email ",
          { text: "petitocarservice@libero.it", href: "mailto:petitocarservice@libero.it" },
          ", telefono 0823 830658.",
        ),
        p(
          "Per esercitare i tuoi diritti puoi scrivere alla PEC o all’indirizzo email indicati sopra.",
        ),
      ],
    },
    {
      id: "privacy-dati",
      title: "Quali dati trattiamo",
      blocks: [
        list(
          [
            "Dati di navigazione: indirizzo IP, data e ora della richiesta, pagina richiesta e informazioni tecniche sul browser, raccolti dai sistemi che ospitano il sito per garantirne il funzionamento e la sicurezza.",
          ],
          [
            "Dati forniti volontariamente quando ci contatti per telefono, email, PEC o WhatsApp: nome, recapiti e contenuto del messaggio, comprese le informazioni sul veicolo che scegli di condividere.",
          ],
          [
            "Il sito non prevede moduli di registrazione, aree riservate, newsletter o sistemi di profilazione.",
          ],
        ),
      ],
    },
    {
      id: "privacy-finalita",
      title: "Finalità e basi giuridiche",
      blocks: [
        list(
          [
            "Rispondere alle richieste e formulare preventivi: trattamento necessario per l’esecuzione di misure precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b, GDPR).",
          ],
          [
            "Adempiere a obblighi di legge, contabili e fiscali (art. 6, par. 1, lett. c, GDPR).",
          ],
          [
            "Garantire la sicurezza del sito e prevenirne abusi: interesse legittimo del Titolare (art. 6, par. 1, lett. f, GDPR).",
          ],
        ),
      ],
    },
    {
      id: "privacy-modalita",
      title: "Modalità del trattamento",
      blocks: [
        p(
          "I dati sono trattati con strumenti elettronici, con misure tecniche e organizzative adeguate e con accesso limitato al personale autorizzato. Non effettuiamo profilazione né prendiamo decisioni automatizzate che producano effetti giuridici sulla persona.",
        ),
      ],
    },
    {
      id: "privacy-destinatari",
      title: "Destinatari dei dati",
      blocks: [
        p(
          "I dati possono essere comunicati a fornitori di hosting e manutenzione tecnica, fornitori di posta elettronica e PEC, WhatsApp (Meta) quando scegli di contattarci tramite quel canale, consulenti fiscali e legali, e autorità pubbliche quando previsto dalla legge. I dati non sono venduti né ceduti a terzi per finalità commerciali.",
        ),
        p(
          "I link a Google Maps aprono il servizio solo su tua iniziativa: da quel momento si applicano le informative di Google.",
        ),
      ],
    },
    {
      id: "privacy-trasferimenti",
      title: "Trasferimenti fuori dallo SEE",
      blocks: [
        p(
          "Alcuni fornitori, come Meta per WhatsApp e Google per Maps, possono trattare dati al di fuori dello Spazio Economico Europeo. In tal caso il trasferimento avviene sulla base di garanzie adeguate, come le clausole contrattuali standard approvate dalla Commissione europea. Il sito non incorpora widget o script di terze parti.",
        ),
      ],
    },
    {
      id: "privacy-conservazione",
      title: "Conservazione",
      blocks: [
        list(
          [
            "Richieste di informazioni e preventivi: per il tempo necessario a gestirle e a dare seguito all’eventuale rapporto.",
          ],
          ["Dati contabili e fiscali: per i termini previsti dalla legge."],
          [
            "Log tecnici: per il periodo strettamente necessario alla sicurezza, di norma non superiore a 30 giorni.",
          ],
        ),
        p("Trascorsi i termini, i dati sono cancellati o resi anonimi."),
      ],
    },
    {
      id: "privacy-diritti",
      title: "Diritti dell’interessato",
      blocks: [
        p(
          "Puoi chiedere in ogni momento l’accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento e la portabilità, oppure opporti al trattamento. Le richieste sono gestite entro un mese.",
        ),
        p(
          "Se ritieni che il trattamento violi il GDPR puoi proporre reclamo al Garante per la protezione dei dati personali: ",
          { text: "www.garanteprivacy.it", href: "https://www.garanteprivacy.it" },
          ".",
        ),
      ],
    },
    {
      id: "privacy-minori",
      title: "Minori",
      blocks: [
        p(
          "I servizi presentati sul sito non sono destinati a minori di 18 anni. Se dati di minori fossero trattati accidentalmente, saranno cancellati su richiesta.",
        ),
      ],
    },
    {
      id: "privacy-modifiche",
      title: "Modifiche",
      blocks: [
        p(
          "Questa informativa può essere aggiornata per riflettere modifiche normative o organizzative. La versione vigente è sempre pubblicata su questa pagina.",
        ),
      ],
    },
  ],
}

export const cookiePolicy: LegalDocument = {
  id: "cookie",
  title: "Cookie policy",
  updated: "4 novembre 2026",
  sections: [
    {
      id: "cookie-cosa",
      title: "Cosa sono i cookie",
      blocks: [
        p(
          "I cookie sono piccoli file di testo che un sito può salvare sul dispositivo dell’utente. Servono, ad esempio, a ricordare preferenze o a raccogliere informazioni statistiche. Tecnologie simili, come il local storage, funzionano in modo analogo.",
        ),
      ],
    },
    {
      id: "cookie-utilizzati",
      title: "Cookie utilizzati da questo sito",
      blocks: [
        p(
          "Il sito non utilizza cookie di profilazione, cookie analitici, pixel pubblicitari o strumenti di tracciamento. Non sono presenti banner o preferenze cookie da gestire, perché non viene richiesto alcun consenso.",
        ),
        p(
          "Eventuali cookie tecnici necessari alla sicurezza e alla distribuzione dei contenuti possono essere gestiti dal fornitore di hosting. Tali cookie non richiedono consenso e non profilano l’utente.",
        ),
      ],
    },
    {
      id: "cookie-esterni",
      title: "Collegamenti a siti esterni",
      blocks: [
        p(
          "Il sito contiene link a WhatsApp, Google Maps, PEC ed email. Questi servizi si aprono solo quando li selezioni e da quel momento applicano le proprie informative e le proprie impostazioni sui cookie: ",
          { text: "WhatsApp", href: "https://www.whatsapp.com/legal/privacy-policy" },
          ", ",
          { text: "Google", href: "https://policies.google.com/privacy" },
          ".",
        ),
      ],
    },
    {
      id: "cookie-gestione",
      title: "Come gestire i cookie",
      blocks: [
        p(
          "Puoi eliminare o bloccare i cookie dalle impostazioni del tuo browser. Poiché questo sito non installa cookie propri, la gestione riguarda eventualmente i servizi esterni visitati tramite i link.",
        ),
      ],
    },
    {
      id: "cookie-contatti",
      title: "Titolare e diritti",
      blocks: [
        p(
          `Il Titolare è ${companyName}, Via Quattro Novembre 9, 81025 Marcianise (CE), PEC `,
          { text: "petitocarservicesrls@pec.it", href: "mailto:petitocarservicesrls@pec.it" },
          ". Per i diritti previsti dal GDPR consulta l’informativa privacy.",
        ),
      ],
    },
  ],
}

export const legalDocuments = [privacyPolicy, cookiePolicy] as const
