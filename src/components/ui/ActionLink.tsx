import type { ReactNode } from "react"
import { Icon } from "@/components/Icon"
import type { IconName } from "@/content/site"

type ActionLinkProps = {
  href: string
  children: ReactNode
  variant?: "primary" | "ghost" | "whatsapp"
  icon?: IconName
  className?: string
  external?: boolean
  ariaLabel?: string
}

export function ActionLink({
  href,
  children,
  variant = "primary",
  icon,
  className,
  external = false,
  ariaLabel,
}: ActionLinkProps) {
  const classes = ["button", variant, className].filter(Boolean).join(" ")

  return (
    <a
      className={classes}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {icon ? <Icon name={icon} size={20} /> : null}
      <span>{children}</span>
      {external ? (
        <span className="visually-hidden"> (si apre in una nuova scheda)</span>
      ) : null}
    </a>
  )
}
