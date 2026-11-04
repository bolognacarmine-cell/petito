import { useState } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { faqs } from "@/content/site"

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq-intro">
        <Eyebrow>Domande frequenti</Eyebrow>
        <h2 id="faq-title">
          <span>Prima di</span>
          <span className="title-line">venire in officina.</span>
        </h2>
        <p>Non trovi la risposta che cerchi?</p>
        <a className="text-link" href="#contatti">
          Contattaci direttamente <Icon name="arrow" size={18} />
        </a>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          const triggerId = `faq-trigger-${index}`
          const panelId = `faq-panel-${index}`

          return (
            <div
              className={isOpen ? "faq-item is-open" : "faq-item"}
              key={faq.question}
            >
              <h3 className="faq-heading">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-sign" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>

              <div
                className="faq-panel"
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                inert={!isOpen}
              >
                <div className="faq-panel-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
