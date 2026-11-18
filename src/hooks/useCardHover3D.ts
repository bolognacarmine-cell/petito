import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useCardHover3D({
  ref,
  tilt = 15,
  scale = 1.02,
  duration = 0.3,
}: {
  ref: React.RefObject<HTMLElement | null>
  tilt?: number
  scale?: number
  duration?: number
}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const hoverTl = gsap.timeline({ paused: true })
    const leaveTl = gsap.timeline({ paused: true })

    hoverTl.to(el, {
      rotateX: -tilt,
      rotateY: tilt * 0.5,
      scale,
      ease: "power2.out",
      duration,
    })

    leaveTl.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "power2.in",
      duration: duration * 0.6,
    })

    el.addEventListener("mouseenter", () => {
      hoverTl.restart()
    })

    el.addEventListener("mouseleave", () => {
      leaveTl.restart()
    })

    return () => {
      hoverTl.kill()
      leaveTl.kill()
      el.removeEventListener("mouseenter", () => {})
      el.removeEventListener("mouseleave", () => {})
    }
  }, [ref, tilt, scale, duration])
}