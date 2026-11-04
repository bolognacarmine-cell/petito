import { Icon } from "@/components/Icon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { reviews } from "@/content/site"

export function Testimonials() {
  return (
    <section
      className="testimonials"
      id="recensioni"
      aria-labelledby="reviews-title"
    >
      <div className="section-heading">
        <div>
          <Eyebrow>Dicono di noi</Eyebrow>
          <h2 className="section-title" id="reviews-title">
            <span>La fiducia si costruisce</span>
            <span className="title-line">un intervento alla volta.</span>
          </h2>
        </div>
      </div>

      <ul className="review-grid">
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
