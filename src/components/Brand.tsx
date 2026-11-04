import { media } from "@/content/site"

type BrandProps = {
  href?: string
  className?: string
}

export function Brand({ href = "#home", className }: BrandProps) {
  const classes = className ? `brand ${className}` : "brand"

  return (
    <a
      className={classes}
      href={href}
      aria-label="Petito Car Service S.R.L.S. — Home"
    >
      <img
        className="brand-logo"
        src={media.logo}
        alt=""
        width="48"
        height="48"
        decoding="async"
      />
      <span className="brand-copy">
        <strong>PETITO CAR</strong>
        <small>SERVICE SRLS</small>
      </span>
    </a>
  )
}
