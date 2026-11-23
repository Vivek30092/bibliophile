const DEFAULT_PHONE = '917828659551';

export function getWhatsAppNumber(): string {
  const envPhone = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envPhone && typeof envPhone === 'string' && envPhone.trim()) {
    // Strip +, spaces, dashes
    return envPhone.replace(/[^0-9]/g, '');
  }
  return DEFAULT_PHONE;
}

export function generateBookWhatsAppLink(book: {
  id: string;
  title: string;
  author: string;
}): string {
  const phone = getWhatsAppNumber();
  const text = `Hi Bibliophile Vibes! I would like to enquire about renting "${book.title}" by ${book.author} (Book ID: ${book.id}). Is it available?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralWhatsAppLink(): string {
  const phone = getWhatsAppNumber();
  const text = `Hi Bibliophile Vibes! I have an enquiry about your book rental library.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
