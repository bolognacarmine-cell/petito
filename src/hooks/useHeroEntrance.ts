import { useEffect } from "react"
import gsap from "gsap"
import { usePrefersReducedMotion } from "@/hooks/useUiPreferences"

/**
 * Anima l'ingresso dell'hero al caricamento della pagina.
 * Rispetta prefers-reduced-motion: in quel caso tutto resta visibile
 * senza animazione.
 */
export function useHeroEntrance({
  eyebrowRef,
  headlineRef,
  leadRef,
  actionsRef,
  trustRef,
  cardRef,
}: {
  eyebrowRef: React.RefObject<HTMLElement | null>
  headlineRef: React.RefObject<HTMLElement | null>
  leadRef: React.RefObject<HTMLElement | null>
  actionsRef: React.RefObject<HTMLElement | null>
  trustRef: React.RefObject<HTMLElement | null>
  cardRef: React.RefObject<HTMLElement | null>
}) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const targets = [
      eyebrowRef.current,
      headlineRef.current,
      leadRef.current,
      actionsRef.current,
      trustRef.current,
      cardRef.current,
    ].filter(Boolean) as HTMLElement[]

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    gsap.set(targets, { opacity: 0, y: 40 })

    const tl = gsap.timeline()
    tl.to(
      eyebrowRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.1,
    )
    tl.to(
      headlineRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.2,
    )
    tl.to(
      leadRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.35,
    )
    tl.to(
      actionsRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.5,
    )
    tl.to(
      trustRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.65,
    )
    tl.to(
      cardRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.8,
    )

    return () => {
      tl.kill()
    }
  }, [eyebrowRef, headlineRef, leadRef, actionsRef, trustRef, cardRef, reduced])
}
