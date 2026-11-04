import { useRef } from "react"
import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SectionReveal } from "@/components/ui/SectionReveal"
import { reviews } from "@/content/site"
import { useScrollReveal, useStaggerReveal } from "@/hooks"

export function Testimonials() {
  const headingRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)

  useScrollReveal({ ref: headingRef, fromY: 40, duration: 0.6 })
  useStaggerReveal({
    containerRef: gridRef,
    selector: ".review-card",
    fromY: 40,
    duration: 0.5,
    stagger: 0.12,
  })

  return (
    <section
      className="testimonials"
      id="recensioni"
      aria-labelledby="reviews-title"
    >
      <div className="section-heading">
        <SectionReveal fromY={40} duration={0.6}>
          <div ref={headingRef as never}>
            <Eyebrow>Dicono di noi</Eyebrow>
            <h2 className="section-title" id="reviews-title">
              <span>La fiducia si costruisce</span>
              <span className="title-line">un intervento alla volta.</span>
            </h2>
          </div>
        </SectionReveal>
      </div>

      <ul className="review-grid" ref={gridRef as never}>
        {reviews.map((review) => (
          <li key={review.title}>
            <figure className="review-card">
              <Icon name="quote" size={30} className="review-quote" />
              <p className="stars">
                <span aria-hidden="true">★★★★★</span>
                <span className="visually-hidden">
                  Valutazione: 5 stelle su 5
                </span>
              </p>
              <h3>{review.title}</h3>
              <blockquote>
                <p>{review.quote}</p>
              </blockquote>
              <figcaption>{review.author}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
