import { useRef } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"

/**
 * Wrapper che applica un reveal all'ingresso in viewport al proprio figlio
 * (eseguito su un div di wrapping). Rispetta prefers-reduced-motion.
 */
export function SectionReveal({
  children,
  fromY = 60,
  duration = 0.6,
  className = "",
}: {
  children: React.ReactNode
  fromY?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollReveal({ ref, fromY, duration })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
