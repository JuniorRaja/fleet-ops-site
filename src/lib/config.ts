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

export const PHOTOS = {
  yard: "https://images.pexels.com/photos/35097902/pexels-photo-35097902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  aerial: "https://images.pexels.com/photos/13961752/pexels-photo-13961752.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  workshop: "https://images.pexels.com/photos/7564857/pexels-photo-7564857.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  buses: "https://images.pexels.com/photos/2696083/pexels-photo-2696083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1000",
} as const;
