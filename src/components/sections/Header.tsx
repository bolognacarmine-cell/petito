import { useEffect, useRef, useState } from "react"
import { Brand } from "@/components/Brand"
import { Icon } from "@/components/Icon"
import { contact, navigation } from "@/content/site"
import { useActiveSection } from "@/hooks/useUiPreferences"

const sectionIds = navigation.map((item) => item.id)

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(sectionIds)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.body.dataset.menuOpen = "true"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      delete document.body.dataset.menuOpen
    }
  }, [menuOpen])

  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)")
    const onChange = () => setMenuOpen(false)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Brand />

        <nav
          id="primary-navigation"
          className={menuOpen ? "nav-links is-open" : "nav-links"}
          aria-label="Navigazione principale"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <a className="header-phone" href={contact.mobile.href}>
            <span className="header-phone-icon" aria-hidden="true">
              <Icon name="phone" size={18} />
            </span>
            <span className="header-phone-copy">
              <small>Chiama ora</small>
              <strong>{contact.mobile.label}</strong>
            </span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="nav-backdrop"
          role="presentation"
          aria-hidden="true"
          onClick={closeMenu}
        />
      ) : null}
    </header>
  )
}
