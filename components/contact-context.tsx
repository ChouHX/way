"use client";

import { createContext, useContext } from "react";
import type { ContactSettings } from "@/lib/contact";

const ContactContext = createContext<ContactSettings | null>(null);

export function ContactProvider({ contact, children }: { contact: ContactSettings; children: React.ReactNode }) {
  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>;
}

export function useContactSettings() {
  const contact = useContext(ContactContext);
  if (!contact) throw new Error("ContactProvider is missing");
  return contact;
}
