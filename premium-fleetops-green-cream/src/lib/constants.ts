export const WHATSAPP_TEXT = encodeURIComponent(
  "Hi, I would like a Fleet Ops demo.\nCompany:\nCity:\nVehicles: __ lorries / __ trailers / __ buses\nBest time to call:",
);

export const WHATSAPP_LINK = `https://wa.me/{{WHATSAPP_NUMBER}}?text=${WHATSAPP_TEXT}`;

export const EMAIL_BODY = encodeURIComponent(
  "Hi Fleet Ops team,\n\nI'd like to book a demo. Here are our details:\nCompany:\nCity:\nFleet size:\nBest time to call:\n\nThanks,",
);

export const EMAIL_LINK = `mailto:{{DEMO_EMAIL}}?subject=Fleet%20Ops%20demo%20request&body=${EMAIL_BODY}`;

export const APP_URL = "{{APP_URL}}";

export const NAV = [
  { label: "Compliance", href: "#compliance" },
  { label: "Dispatch", href: "#dispatch" },
  { label: "One Save", href: "#onesave" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];
