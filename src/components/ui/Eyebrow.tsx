import type { ReactNode } from "react"

type EyebrowProps = {
  children: ReactNode
  tone?: "on-light" | "on-dark"
  className?: string
}

export function Eyebrow({ children, tone = "on-light", className }: EyebrowProps) {
  const classes = ["eyebrow", tone === "on-dark" ? "is-on-dark" : "", className]
    .filter(Boolean)
    .join(" ")

  return <p className={classes}>{children}</p>
}
