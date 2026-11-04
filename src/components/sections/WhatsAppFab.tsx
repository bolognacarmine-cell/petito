import { Icon } from "@/components/Icon"
import { contact } from "@/content/site"

export function WhatsAppFab() {
  return (
    <a
      className="floating-whatsapp"
      href={contact.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contattaci su WhatsApp (si apre in una nuova scheda)"
    >
      <Icon name="whatsapp" size={25} />
    </a>
  )
}
