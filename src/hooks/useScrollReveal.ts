import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@/hooks/useUiPreferences"

gsap.registerPlugin(ScrollTrigger)

/**
 * Applica un'animazione di reveal all'elemento quando entra in viewport.
 * Rispetta prefers-reduced-motion: in quel caso l'elemento resta visibile
 * senza animazione e non si instanzia ScrollTrigger.
 * L'animazione parte una sola volta (non si riavvia al ritorno indietro).
 */
export function useScrollReveal({
  ref,
  fromY = 60,
  opacity = 0,
  duration = 0.6,
  ease = "power2.out",
  once = true,
}: {
  ref: React.RefObject<HTMLElement | null>
  fromY?: number
  opacity?: number
  duration?: number
  ease?: string
  once?: boolean
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity, y: fromY })

    const animation = gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        end: "bottom 60%",
        toggleActions: once ? "play none none none" : "play none none reverse",
        once,
      },
      opacity: 1,
      y: 0,
      duration,
      ease,
      overwrite: true,
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [ref, fromY, opacity, duration, ease, once, reduced])
}
