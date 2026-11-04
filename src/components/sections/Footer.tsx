import { useState } from "react"
import { Brand } from "@/components/Brand"
import { LegalDialog } from "@/components/legal/LegalDialog"
import { cookiePolicy, privacyPolicy } from "@/content/legal"
import { navigation, contact, company } from "@/content/site"

type LegalDocumentId = "privacy" | "cookie"

const legalDocuments = {
  privacy: privacyPolicy,
  cookie: cookiePolicy,
} as const

export function Footer() {
  const year = new Date().getFullYear()
  const [openDocument, setOpenDocument] = useState<LegalDocumentId | null>(
    null,
  )

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <Brand className="footer-brand" />
          <p>Assistenza meccanica per auto e moto a Marcianise.</p>
        </div>

        <nav className="footer-nav" aria-label="Collegamenti secondari">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer-contact">
          <a href={contact.phone.href}>{contact.phone.label}</a>
          <a href={contact.email.href}>{contact.email.label}</a>
        </div>

        <div className="footer-legal">
          <p>
            © {year} {company.name} · Tutti i diritti riservati.
          </p>
          <p>
            Sede legale: {company.registeredOffice} · P. IVA/C.F.{" "}
            {company.vat} · P. IVA UE {company.vatEu} · REA {company.rea}
          </p>
          <p>
            PEC{" "}
            <a href={`mailto:${company.pec}`}>{company.pec}</a>
          </p>
          <p className="footer-legal-links">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setOpenDocument("privacy")}
            >
              Privacy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setOpenDocument("cookie")}
            >
              Cookie
            </button>
          </p>
        </div>
      </div>

      {openDocument ? (
        <LegalDialog
          key={openDocument}
          legalDocument={legalDocuments[openDocument]}
          onClose={() => setOpenDocument(null)}
        />
      ) : null}
    </footer>
  )
}
