import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@/hooks/useUiPreferences"

gsap.registerPlugin(ScrollTrigger)

/**
 * Anima i figli diretti di un container con effetto sfalsato (stagger)
 * all'ingresso in viewport. Rispetta prefers-reduced-motion.
 * L'animazione parte una sola volta.
 */
export function useStaggerReveal({
  containerRef,
  selector = "> *",
  fromY = 40,
  duration = 0.5,
  stagger = 0.12,
  ease = "power2.out",
  start = "top 82%",
}: {
  containerRef: React.RefObject<HTMLElement | null>
  selector?: string
  fromY?: number
  duration?: number
  stagger?: number
  ease?: string
  start?: string
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll<HTMLElement>(selector))
    if (items.length === 0) return

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 })
      return
    }

    gsap.set(items, { opacity: 0, y: fromY })

    const animation = gsap.to(items, {
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: "play none none none",
        once: true,
      },
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      overwrite: true,
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill()
      })
    }
  }, [containerRef, selector, fromY, duration, stagger, ease, start, reduced])
}
