import { WHATSAPP_NUMBER } from "@/lib/config";
import { fmtDate, TODAY } from "@/lib/fleet";

export const roles = {
  eyebrow: "Roles",
  heading: "Give every team member the right access.",
  items: [
    { name: "Owner", lines: ["Everything, including profit", "Cost per km and trip money", "Company settings and users"], featured: true },
    { name: "Transport in-charge", lines: ["Trips, papers, fuel and tyres", "Vehicles and drivers", "Profit stays hidden"] },
    { name: "Accountant", lines: ["Trip money and the unbilled list", "Mark trips billed", "A monthly voucher CSV"] },
  ],
  record: { what: "Closed trip changed", who: "Ravi · Transport in-charge", when: `${fmtDate(TODAY)} · 6:12 PM`, change: "₹18,400 → ₹18,900", reason: "toll receipt added" },
  recordNote: "Change a closed trip and the old value, the new value and the reason stay on record.",
};

export const more = {
  eyebrow: "Everything your fleet team needs",
  heading: "Manage daily fleet work from one place.",
  tiles: [
    { name: "Fuel and maintenance", body: "Track fuel, mileage, workshop jobs, service dates and tyre life.", size: "wide" },
    { name: "Challan lookup", body: "Check vehicle challans without leaving your fleet workspace.", size: "tall" },
    { name: "Driver licence checks", body: "Check licence details and get expiry reminders before they become a problem.", size: "base" },
    { name: "Works on your phone", body: "Use Fleet OPS in your phone browser. Nothing needs installing.", size: "phone" },
    { name: "Driver accounts and payments", body: "Track advances, batta, settlements and payment history for every driver.", size: "base" },
    { name: "Reports and insights", body: "See costs, revenue and weekly business reports built for fleet owners.", size: "wide" },
    { name: "WhatsApp and email alerts", body: "Send document and service reminders through channels your team already uses.", size: "base" },
    { name: "Protected business data", body: "Our privacy policy and EULA explain how data is handled under applicable Indian and GDPR requirements.", size: "wide" },
  ],
};

export const honest = {
  eyebrow: "Straight answers",
  heading: "Know exactly what Fleet OPS does.",
  nots: ["No GPS box", "No live tracking", "No driver app", "No bus tickets", "No government filing", "Not an accounting package"],
  notsNote: "Need something else? Message us.",
  faq: [
    { q: "Does it track my vehicles?", a: "No. Fleet Ops is office software. There is no GPS, no live map and nothing to fit in your vehicles." },
    { q: "Does it remind me before papers expire?", a: "Yes. It shows every vehicle document in one place and sends WhatsApp or email reminders before expiry." },
    { q: "Does it work for buses?", a: "Yes, for papers, trips, fuel, maintenance and tyres. It does not do tickets, bookings, fares or timetables." },
    { q: "Does it work on my phone?", a: "Yes, in your phone’s web browser. There is no separate app to install." },
    { q: "What does it cost?", a: "Fleet OPS costs ₹499 per truck each month. A one-time vehicle onboarding charge also applies." },
  ],
};

export const questionHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I have a question about Fleet Ops:")}`;
