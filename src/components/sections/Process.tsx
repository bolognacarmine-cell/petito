import { useRef } from "react"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { processSteps } from "@/content/site"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { useScrollReveal, useStaggerReveal } from "@/hooks"

export function Process() {
  const headingRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)

  useScrollReveal({ ref: headingRef, fromY: 40, duration: 0.6 })
  useStaggerReveal({
    containerRef: gridRef,
    selector: ".process-grid > li",
    fromY: 30,
    duration: 0.5,
    stagger: 0.12,
  })

  return (
    <section className="process" aria-labelledby="process-title">
      <SectionReveal fromY={40} duration={0.6}>
        <div ref={headingRef as never}>
          <Eyebrow>Come lavoriamo</Eyebrow>
          <h2 id="process-title">
            <span>Semplice, chiaro,</span>
            <span className="title-line">senza sorprese.</span>
          </h2>
        </div>
      </SectionReveal>

      <ol className="process-grid" ref={gridRef as never}>
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
