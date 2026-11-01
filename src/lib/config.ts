export const PH = {
  whatsapp: "+91 78711 94171",
  email: "info@fleetops.in",
  reply: "2 hours",
  app: "app.fleetops.in",
  company: "VIDID Softech",
  phone: "+91 78711 94171",
} as const;

export const WHATSAPP_NUMBER = "917871194171";
export const PHONE_HREF = "tel:+917871194171";

export const WA_TEXT =
  "Hi, I would like a Fleet Ops demo.\nCompany:\nCity:\nVehicles: __ lorries / __ trailers / __ buses\nBest time to call:";

export const WHATSAPP_HREF = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WA_TEXT);

export const MAIL_BODY =
  "Hi Fleet Ops team,\n\nI would like a demo.\n\nCompany:\nCity:\nFleet size (lorries / trailers / buses):\nBest time to call:\n\nThank you.";

export const EMAIL_HREF =
  "mailto:info@fleetops.in?subject=Fleet%20Ops%20demo%20request&body=" + encodeURIComponent(MAIL_BODY);

export const APP_HREF = "https://app.fleetops.in";
