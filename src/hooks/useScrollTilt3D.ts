import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Applica un'effetto tilt 3D all'elemento mentre si scorre.
 * L'angolo di inclinazione segue lo scorrimento verticale.
 * Rispetta prefers-reduced-motion: disabilitato in quel caso.
 */
export function useScrollTilt3D({
  ref,
  maxAngle = 15,
  axis = "both",
}: {
  ref: React.RefObject<HTMLElement | null>
  maxAngle?: number
  axis?: "x" | "y" | "both"
}) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const isX = axis === "x" || axis === "both"
    const isY = axis === "y" || axis === "both"

    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = self.progress // 0 a 1
        let angleX = 0
        let angleY = 0

        if (isY) {
          angleY = (progress - 0.5) * maxAngle
        }
        if (isX) {
          // angle based on horizontal scroll position or midpoint
          angleX = (progress - 0.5) * maxAngle * 0.5
        }

        gsap.set(el, {
          rotateX: angleX,
          rotateY: angleY,
          transformOrigin: "center center",
        })
      },
    })
  }, [ref, maxAngle, axis, reduced])
}