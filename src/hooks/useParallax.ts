import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export function useParallax({
  ref,
  intensity = 20,
  axis = "both",
}: {
  ref: React.RefObject<HTMLElement | null>
  intensity?: number
  axis?: "x" | "y" | "both"
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      setMouse({
        x: (e.clientX / w) * 2 - 1,
        y: -(e.clientY / h) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", onMouseMove)
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const updatePosition = () => {
      const x = axis === "x" || axis === "both" ? mouse.x * intensity : 0
      const y = axis === "y" || axis === "both" ? mouse.y * intensity : 0
      gsap.set(el, { x: x, y: y })
    }

    updatePosition()

    const raf = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(raf)
  }, [ref, intensity, axis, mouse])
}