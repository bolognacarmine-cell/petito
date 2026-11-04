import type { ReactNode } from "react"
import type { IconName } from "@/content/site"

const paths: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  car: (
    <>
      <path d="m5 11 1.5-4.5h11L19 11" />
      <path d="M3 11h18v7H3z" />
      <path d="M5 18v2M19 18v2M7 14h.01M17 14h.01" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  engine: (
    <>
      <path d="M6 9h11l3 3v6H6z" />
      <path d="M8 9V6h5v3M3 11v5M20 13h2v3h-2M9 13h6" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  motorcycle: (
    <>
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M5 17h6l3-7h3l2 7M9 10h5M7 13l-2-3H3M16 7h3" />
    </>
  ),
  phone: (
    <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-1-2 2c-4-1.5-7.5-5-9-9l2-2Z" />
  ),
  quote: (
    <path d="M7 17H3v-4c0-4 2-6 6-7v2c-2 .6-3 1.7-3 3h3v6Zm10 0h-4v-4c0-4 2-6 6-7v2c-2 .6-3 1.7-3 3h3v6Z" />
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  tool: (
    <path d="M14 7a5 5 0 0 0-6.7 6.7L3 18l3 3 4.3-4.3A5 5 0 0 0 17 10l-3 3-3-3 3-3Z" />
  ),
  whatsapp: (
    <>
      <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
      <path d="M9 8c.5 3 2 4.5 5 5" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
}

type IconProps = {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

/** Decorative inline icon: every usage must be paired with visible text or an aria-label. */
export function Icon({ name, size = 24, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {paths[name]}
    </svg>
  )
}
