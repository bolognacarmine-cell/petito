import { Eyebrow } from "@/components/ui/Eyebrow"
import { processSteps } from "@/content/site"

export function Process() {
  return (
    <section className="process" aria-labelledby="process-title">
      <Eyebrow>Come lavoriamo</Eyebrow>
      <h2 id="process-title">
        <span>Semplice, chiaro,</span>
        <span className="title-line">senza sorprese.</span>
      </h2>

      <ol className="process-grid">
        {processSteps.map((step) => (
          <li key={step.number}>
            <span className="process-number" aria-hidden="true">
              {step.number}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
