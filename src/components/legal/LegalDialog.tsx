import { useEffect, useRef, type KeyboardEvent } from "react"
import { Icon } from "@/components/Icon"
import type { LegalDocument, LegalInline } from "@/content/legal"

type LegalDialogProps = {
  legalDocument: LegalDocument
  onClose: () => void
}

function InlineText({ value }: { value: LegalInline }) {
  if (typeof value === "string") return <>{value}</>

  const external = value.href.startsWith("http")

  return (
    <a
      href={value.href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {value.text}
    </a>
  )
}

export function LegalDialog({ legalDocument, onClose }: LegalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="legal-dialog"
      aria-labelledby="legal-dialog-title"
      onKeyDown={onDialogKeyDown}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
    >
      <div className="legal-dialog-inner">
        <header className="legal-dialog-header">
          <div>
            <p className="eyebrow">Informazioni legali</p>
            <h2 id="legal-dialog-title">{legalDocument.title}</h2>
            <p className="legal-dialog-updated">
              Ultimo aggiornamento: {legalDocument.updated}
            </p>
          </div>
          <button
            type="button"
            className="legal-dialog-close"
            autoFocus
            aria-label="Chiudi l’informativa"
            onClick={() => dialogRef.current?.close()}
          >
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="legal-dialog-body">
          {legalDocument.sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h3 id={section.id}>{section.title}</h3>

              {section.blocks.map((block, blockIndex) =>
                block.kind === "p" ? (
                  <p key={blockIndex}>
                    {block.content.map((value, index) => (
                      <InlineText key={index} value={value} />
                    ))}
                  </p>
                ) : (
                  <ul key={blockIndex}>
                    {block.items.map((item, index) => (
                      <li key={index}>
                        {item.map((value, valueIndex) => (
                          <InlineText key={valueIndex} value={value} />
                        ))}
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>

        <footer className="legal-dialog-footer">
          <button
            type="button"
            className="button primary"
            onClick={() => dialogRef.current?.close()}
          >
            Chiudi
          </button>
        </footer>
      </div>
    </dialog>
  )
}
