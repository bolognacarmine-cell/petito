import { useEffect, useState } from "react"
import { Icon } from "@/components/Icon"
import { contact } from "@/content/site"

/**
 * Phone-first CTA fixed to the bottom of the viewport on small screens.
 * It steps aside as soon as the contact section is on screen, so it never
 * competes with the full contact block.
 */
export function MobileCallBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    const contactSection = document.getElementById("contatti")
    if (!contactSection) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry) setHidden(entry.isIntersecting)
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.15 },
    )

    observer.observe(contactSection)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={hidden ? "mobile-call-bar is-hidden" : "mobile-call-bar"}>
      <a className="mobile-call-bar__cta" href={contact.mobile.href}>
        <Icon name="phone" size={20} />
        <span className="mobile-call-bar__label">Chiama ora</span>
        <span className="mobile-call-bar__number">{contact.mobile.label}</span>
      </a>
    </div>
  )
}
