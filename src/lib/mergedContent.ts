export const roles = {
  eyebrow: "Roles",
  heading: "Your in-charge runs the day. You keep control.",
  items: [
    { name: "Owner", lines: ["Everything, including profit", "Cost per km and trip money", "Company settings and users"], featured: true },
    { name: "Transport in-charge", lines: ["Trips, papers, fuel and tyres", "Vehicles and drivers", "Profit stays hidden"] },
    { name: "Accountant", lines: ["Trip money and the unbilled list", "Mark trips billed", "A monthly voucher CSV"] },
  ],
  record: { what: "Closed trip changed", who: "Ravi · Transport in-charge", when: "13 Oct · 6:12 PM", change: "₹18,400 → ₹18,900", reason: "toll receipt added" },
  recordNote: "Change a closed trip and the old value, the new value and the reason stay on record.",
};

export const more = {
  eyebrow: "More in the office",
  heading: "The rest of the office, in the same place.",
  tiles: [
    { name: "Fuel log", body: "Every fill with litres and rate. Fills with an odd mileage or rate are flagged.", size: "wide" },
    { name: "Maintenance", body: "Workshop jobs, and service due by km or by date.", size: "tall" },
    { name: "Tyres", body: "Fit, rotate, retread, scrap. Know how far each tyre ran.", size: "base" },
    { name: "Works on your phone", body: "Open it in your phone’s browser. Nothing to install.", size: "phone" },
    { name: "Reports", body: "Cost per km and revenue against cost, as CSV and PDF.", size: "base" },
    { name: "Excel import", body: "Load your vehicles from a spreadsheet. Mistakes show before anything saves.", size: "wide" },
  ],
};

export const honest = {
  eyebrow: "Straight answers",
  heading: "What Fleet Ops does not do.",
  nots: ["No GPS box", "No live tracking", "No driver app", "No bus tickets", "No government filing", "Not an accounting package"],
  notsNote: "Need something else? Message us.",
  faq: [
    { q: "Does it track my vehicles?", a: "No. Fleet Ops is office software. There is no GPS, no live map and nothing to fit in your vehicles." },
    { q: "Does it remind me before papers expire?", a: "Yes. It shows every vehicle’s six papers in one place, marks what is due or expired, and sends email reminders before a paper is due." },
    { q: "Does it work for buses?", a: "Yes, for papers, trips, fuel, maintenance and tyres. It does not do tickets, bookings, fares or timetables." },
    { q: "Does it work on my phone?", a: "Yes, in your phone’s web browser. There is no separate app to install." },
    { q: "What does it cost?", a: "We share the price in your demo. It depends on the size of your fleet." },
  ],
};

export const questionHref = `https://wa.me/{{WHATSAPP_NUMBER}}?text=${encodeURIComponent("Hi, I have a question about Fleet Ops:")}`;
