export const social = [
  { url: "mailto:me@david-hckh.com", name: "mail" },
  { url: "https://www.facebook.com/JunKioStudio/", name: "facebook" },
  { url: "https://www.linkedin.com/in/jun-kio-75934a3b4/", name: "linkedin" },
] as const satisfies { url: string; name: "mail" | "facebook" | "linkedin" }[];
