/**
 * Every word on the page. Plates, names and figures are example data, and
 * the page says so. Replace every {{PLACEHOLDER}} before you ship.
 *
 * Claim rules (from the Fleet Ops marketing docs):
 * - Never say a trip or vehicle is blocked because a paper expired.
 * - No GPS, maps, live tracking, driver app, tickets, testimonials or counts.
 */

export const brand = {
  name: 'Fleet Ops',
  whatsapp: '{{WHATSAPP_NUMBER}}', // international format, digits only, e.g. 919800000000
  email: '{{DEMO_EMAIL}}',
  replyTime: '{{REPLY_TIME}}', // e.g. "one working day"
  appUrl: '{{APP_URL}}',
  company: '{{COMPANY_NAME}}',
  city: 'Chennai',
};

export const nav = [
  {label: 'Compliance', href: '#compliance'},
  {label: 'Trips', href: '#trips'},
  {label: 'Roles', href: '#roles'},
  {label: 'FAQ', href: '#faq'},
];

export const hero = {
  kicker: 'Fleet office software · Lorries · Trailers · Buses',
  veil: 'Scroll to clear the paperwork',
  title: ['Every paper.', 'Every trip.', 'One screen.'],
  lead: 'Fleet Ops tracks fitness, insurance, PUC, permit, RC and road tax for every vehicle, reminds you before they are due, and turns each trip into fuel, cost and driver accounts.',
  note: 'No GPS box. No app to install.',
  site: 'Ambattur · Chennai · Example data',
};

export type Paper = 'Fitness' | 'Insurance' | 'PUC' | 'Permit' | 'RC' | 'Road tax';
export const papers: {name: Paper; short: string; image: string}[] = [
  {name: 'Fitness', short: 'FIT', image: '/media/papers/fitness.webp'},
  {name: 'Insurance', short: 'INS', image: '/media/papers/insurance.webp'},
  {name: 'PUC', short: 'PUC', image: '/media/papers/puc.webp'},
  {name: 'Permit', short: 'PMT', image: '/media/papers/permit.webp'},
  {name: 'RC', short: 'RC', image: '/media/papers/rc.webp'},
  {name: 'Road tax', short: 'TAX', image: '/media/papers/tax.webp'},
];

/** v = valid, d = due soon, x = expired, p = pending proof. Dates are ISO. */
export type Status = 'v' | 'd' | 'x' | 'p';
export const fleet: {plate: string; kind: string; cells: [Status, string][]}[] = [
  {plate: 'TN 00 AB 1201', kind: 'Lorry', cells: [['v', '2027-03-14'], ['v', '2026-11-14'], ['d', '2026-11-04'], ['v', '2027-06-30'], ['v', '2034-02-01'], ['v', '2027-01-31']]},
  {plate: 'TN 00 CD 3307', kind: 'Container trailer', cells: [['v', '2027-01-09'], ['d', '2026-11-12'], ['x', '2026-10-02'], ['v', '2027-04-18'], ['v', '2033-08-22'], ['v', '2027-03-31']]},
  {plate: 'TN 00 EF 5520', kind: 'Bus', cells: [['p', '2027-02-20'], ['v', '2027-05-01'], ['v', '2027-02-11'], ['v', '2027-09-15'], ['v', '2032-11-30'], ['v', '2026-12-31']]},
  {plate: 'TN 00 GH 7714', kind: 'Lorry', cells: [['v', '2027-07-07'], ['x', '2026-10-09'], ['v', '2027-03-03'], ['v', '2027-05-20'], ['v', '2035-01-12'], ['p', '2027-03-31']]},
  {plate: 'TN 00 JK 8820', kind: 'Lorry', cells: [['v', '2027-08-19'], ['v', '2027-02-02'], ['v', '2027-01-25'], ['d', '2026-11-18'], ['v', '2031-06-06'], ['v', '2027-03-31']]},
  {plate: 'TN 00 LM 4402', kind: 'Bus', cells: [['v', '2027-04-04'], ['v', '2027-06-16'], ['v', '2027-02-27'], ['v', '2027-10-10'], ['v', '2030-09-09'], ['v', '2027-03-31']]},
];

export const statusText: Record<Status, string> = {
  v: 'valid till',
  d: 'due',
  x: 'expired',
  p: 'renewed · proof copy pending · valid till',
};

export const compliance = {
  eyebrow: 'Compliance',
  heading: 'Six papers a vehicle. Each one lands in its column.',
  steps: ['Papers in a file.', 'Each one in its place.', 'See what’s due. Get reminded.'],
  proof: 'Renewals keep the proof copy with the vehicle.',
  filters: [
    {key: 'all', label: 'All'},
    {key: 'd', label: 'Due soon'},
    {key: 'x', label: 'Expired'},
    {key: 'p', label: 'Pending proof'},
  ] as const,
  legend: [
    {key: 'v', label: 'Valid'},
    {key: 'd', label: 'Due soon'},
    {key: 'p', label: 'Pending proof'},
    {key: 'x', label: 'Expired'},
  ] as const,
  reminder: {from: 'Fleet Ops reminders', subject: '3 papers due in the next 30 days'},
};

/** The trip slip — handwritten — and the same values typed into the trip sheet. */
export const slip = [
  {label: 'Vehicle', value: 'TN 00 CD 3307'},
  {label: 'Driver', value: 'Murugan K'},
  {label: 'From', value: 'Chennai Port'},
  {label: 'To', value: 'Sriperumbudur'},
  {label: 'KM', value: '254'},
  {label: 'Diesel', value: '62 L · ₹5,890'},
  {label: 'Toll', value: '₹420'},
  {label: 'Batta', value: '₹600'},
  {label: 'Advance', value: '₹2,000'},
  {label: 'Container', value: 'TCLU 418702 3'},
];

export const trip = {
  eyebrow: 'Trips',
  heading: 'One trip entry. Everything follows.',
  beats: [
    {title: 'The slip', line: 'Every trip starts on paper.', body: 'Vehicle, driver, route, KM, diesel, toll, batta and advance, written by hand at the gate.'},
    {title: 'The pile', line: 'By month end, nobody can add them up.', body: 'Slips collect in a drawer. Diesel, driver money and costs stay guesses until someone sits down with a calculator.'},
    {title: 'Entered once', line: 'Enter it once, or copy it from the slip.', body: 'The in-charge types the slip into one trip sheet. Container fields show only on container trips.'},
    {title: 'Save', line: 'One save.', body: 'The trip, its expenses, the diesel fill and the driver’s account save together, or nothing saves.'},
    {title: 'Everything follows', line: 'Fuel, driver money and costs work themselves out.', body: 'The same trip feeds the diesel log, the driver’s account, cost per km, the accountant’s unbilled list and the dashboard.'},
  ],
  outputs: [
    {name: 'Trip', value: 'Closed · Unbilled', sub: 'Freight ₹18,400'},
    {name: 'Diesel log', value: '62 L · 4.1 km/L', sub: 'Odd fills are flagged'},
    {name: 'Driver account', value: 'Advance ₹2,000', sub: 'Batta ₹600'},
    {name: 'Cost per km', value: '₹27.2 / km', sub: 'This trip'},
    {name: 'Accountant', value: 'Unbilled ₹18,400', sub: 'Ready to mark billed'},
    {name: 'Dashboard', value: 'Trips this month 39', sub: 'Updated'},
  ],
  slipsThisMonth: 38,
};

export const roles = {
  eyebrow: 'Roles',
  heading: 'Your in-charge runs the day. You keep control.',
  items: [
    {name: 'Owner', lines: ['Everything, including profit', 'Cost per km and trip money', 'Company settings and users'], featured: true},
    {name: 'Transport in-charge', lines: ['Trips, papers, fuel and tyres', 'Vehicles and drivers', 'Profit stays hidden']},
    {name: 'Accountant', lines: ['Trip money and the unbilled list', 'Mark trips billed', 'A monthly voucher CSV']},
  ],
  record: {what: 'Closed trip changed', who: 'Ravi · Transport in-charge', when: '13 Oct · 6:12 PM', change: '₹18,400 → ₹18,900', reason: 'toll receipt added'},
  recordNote: 'Change a closed trip and the old value, the new value and the reason stay on record.',
};

export const more = {
  eyebrow: 'More in the office',
  heading: 'The rest of the office, in the same place.',
  tiles: [
    {name: 'Fuel log', body: 'Every fill with litres and rate. Fills with an odd mileage or rate are flagged.', size: 'wide'},
    {name: 'Maintenance', body: 'Workshop jobs, and service due by km or by date.', size: 'tall'},
    {name: 'Tyres', body: 'Fit, rotate, retread, scrap. Know how far each tyre ran.', size: 'base'},
    {name: 'Works on your phone', body: 'Open it in your phone’s browser. Nothing to install.', size: 'phone'},
    {name: 'Reports', body: 'Cost per km and revenue against cost, as CSV and PDF.', size: 'base'},
    {name: 'Excel import', body: 'Load your vehicles from a spreadsheet. Mistakes show before anything saves.', size: 'wide'},
  ],
};

export const honest = {
  eyebrow: 'Straight answers',
  heading: 'What Fleet Ops does not do.',
  nots: ['No GPS box', 'No live tracking', 'No driver app', 'No bus tickets', 'No government filing', 'Not an accounting package'],
  notsNote: 'Need something else? Message us.',
  faq: [
    {q: 'Does it track my vehicles?', a: 'No. Fleet Ops is office software. There is no GPS, no live map and nothing to fit in your vehicles.'},
    {q: 'Does it remind me before papers expire?', a: 'Yes. It shows every vehicle’s six papers in one place, marks what is due or expired, and sends email reminders before a paper is due.'},
    {q: 'Does it work for buses?', a: 'Yes, for papers, trips, fuel, maintenance and tyres. It does not do tickets, bookings, fares or timetables.'},
    {q: 'Does it work on my phone?', a: 'Yes, in your phone’s web browser. There is no separate app to install.'},
    {q: 'What does it cost?', a: 'We share the price in your demo. It depends on the size of your fleet.'},
  ],
};

export const demo = {
  eyebrow: 'Book a demo',
  heading: 'Put your fleet on one screen.',
  body: `Send your company, city and fleet size. We reply within ${brand.replyTime} and show you Fleet Ops with example data for your kind of fleet.`,
  signIn: 'Already have an account?',
};

export const footer = {
  statement: 'Get your fleet office off paper.',
  small: 'Plates, names and figures on this page are example data.',
};

/** Drafted message for WhatsApp and email. */
export function demoMessage(f: {name?: string; company?: string; city?: string; lorries?: string; trailers?: string; buses?: string}) {
  return [
    'Hi, I would like a Fleet Ops demo.',
    `Name: ${f.name ?? ''}`,
    `Company: ${f.company ?? ''}`,
    `City: ${f.city ?? ''}`,
    `Vehicles: ${f.lorries || '__'} lorries / ${f.trailers || '__'} trailers / ${f.buses || '__'} buses`,
  ].join('\n');
}

export const whatsappHref = (text = demoMessage({})) => `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
export const emailHref = (text = demoMessage({})) =>
  `mailto:${brand.email}?subject=${encodeURIComponent('Fleet Ops demo request')}&body=${encodeURIComponent(text)}`;
