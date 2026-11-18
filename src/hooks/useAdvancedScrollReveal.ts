import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@/hooks/useUiPreferences"

gsap.registerPlugin(ScrollTrigger)

/**
 * Advanced scroll-reveal animation with multiple trigger options.
 * Supports: start/end positions, scrub (sync with scroll),
 * pinning, and reversed playback.
 * Rispetta prefers-reduced-motion.
 */
export function useAdvancedScrollReveal({
  ref,
  start = "top 80%",
  end = "bottom 20%",
  scrub = false,
  pin = false,
  once = true,
  opacity = 0,
  yFrom = 60,
  duration = 0.8,
  ease = "power2.out",
}: {
  ref: React.RefObject<HTMLElement | null>
  start?: string
  end?: string
  scrub?: boolean
  pin?: boolean
  once?: boolean
  opacity?: number
  yFrom?: number
  duration?: number
  ease?: string
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity, y: yFrom })

    const animation = gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
        pin,
        once,
        // onEnter/onLeave callbacks for enhanced control
        onEnter: () => {
          // Could add additional effects when element enters viewport
        },
      },
      opacity: 1,
      y: 0,
      duration,
      ease,
      overwrite: "auto",
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [ref, start, end, scrub, pin, once, opacity, yFrom, duration, ease, reduced])
}

/**
 * GSAP timeline con ScrollTrigger per animazioni complesse a capitoli.
 * Multiple elementi che animano in sequenza mentre si scorre.
 * scrub: 1 per sincronizzazione perfetta con lo scroll.
 * Nota: this hook è stato rinominato in useChapterAnimation per chiarezza.
 */

export function useChapterAnimation({
  timeline,
  triggers,
  start = "top 0%",
  end = "bottom 100%",
  scrub = true,
  toggleActions = "play none none reverse",
}: {
  timeline: gsap.core.Timeline
  triggers: HTMLElement[]
  start?: string
  end?: string
  scrub?: boolean
  toggleActions?: string
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      timeline.play(0)
      return
    }

    // Create ScrollTriggers for each element in the timeline
    triggers.forEach((trigger) => {
      ScrollTrigger.create({
        trigger,
        start,
        end,
        onUpdate: (self) => {
          // Progress is tied to scroll position
          const progress = self.progress
          // Only play the timeline portion relevant to this chapter
          timeline.progress(Math.min(progress * 0.8, 1)) // 80% of timeline per chapter
        },
      })
    })

    // Main timeline driven by scroll
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: triggers[0],
        start,
        end,
        scrub,
        toggleActions,
      },
    })

    // Add the provided timeline to the scroll-driven timeline
    scrollTl.add(timeline)

    return () => {
      scrollTl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [timeline, triggers, start, end, scrub, toggleActions, reduced])
}

/**
 * Parallax basato su scroll per elementi 3D.
 * L'elemento segue il movimento verticale dello scroll con un moltiplicatore.
 * Ideale per modelli 3D, immagini hero, o elementi che devono sembrare "ancorati".
 */
export function useScrollParallax({
  ref,
  factor = 0.5, // Manyplicatore di movimento (0.5 = metà velocità dello scroll)
  invert = false,
  duration = 1,
}: {
  ref: React.RefObject<HTMLElement | null>
  factor?: number
  invert?: boolean
  duration?: number
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      gsap.set(el, { y: 0 })
      return
    }

    let yScroll = 0
    let ticking = false

    const updatePosition = () => {
      yScroll = window.scrollY
      const movement = yScroll * factor
      const finalY = invert ? -movement : movement

      gsap.set(el, { y: finalY })

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updatePosition()
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    // Initial position
    updatePosition()

    return () => {
      window.removeEventListener("scroll", onScroll)
      gsap.set(el, { y: 0 })
    }
  }, [ref, factor, invert, duration, reduced])
}

/**
 * Fade-in sequenziale con stagger basato su scroll.
 * Elementi appaiono uno dopo l'altro mentre lo scorreva avanza.
 * Ideale per testimonianze, feature list, o punti chiave.
 */
export function useSequentialFade({
  containerRef,
  selector = "> *",
  duration = 0.6,
  stagger = 0.15,
  start = "top 85%",
  end = "bottom 15%",
}: {
  containerRef: React.RefObject<HTMLElement | null>
  selector?: string
  duration?: number
  stagger?: number
  start?: string
  end?: string
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll<HTMLElement>(selector))
    if (items.length === 0) return

    if (reduced) {
      gsap.set(items, { opacity: 1 })
      return
    }

    // Create individual timelines per item, all driven by same scroll trigger
    gsap.set(items, { opacity: 0 })

    items.forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: false,
          // Each item starts its animation based on its index
          // Using a staggard start position
          toggleActions: "play none none none",
        },
        // Stagger using the timeline approach
        overwrite: "auto",
      })
    })

    // Alternative: single timeline with labels per item
    /*const seqTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub: false,
        once: true,
      },
    })

    items.forEach((item, index) => {
      seqTl.to(item, { opacity: 1, duration, ease: "power2.out", y: 0 }, index * stagger)
    })*/

    return () => {
      // Kill all scroll triggers associated with this container
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container || t.trigger === items[0]) t.kill()
      })
    }
  }, [containerRef, selector, duration, stagger, start, end, reduced])
}