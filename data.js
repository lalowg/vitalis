/* VITALIS — content and sample-data definitions.
   Every number labelled "Sample" is illustrative and belongs to no real person. */

export const SYSTEM_ORDER = ['heart', 'lungs', 'brain', 'muscles', 'sleep', 'metabolism'];

export const SYSTEMS = {
  all: {
    sys: 'Overview · 6 systems', title: 'One body, six systems',
    tag: 'No system works alone. Habits that help one usually help several, which is why the same few levers keep appearing.',
    kpis: [['Systems in this atlas', '6', '', 'Atlas'], ['Everyday levers', '6', '', 'Atlas'], ['Weekly habit balance', '72', '/100', 'Sample']],
    chart: { type: 'radar', cap: 'Habit balance across the six systems' },
    research: 'Large population studies consistently link a handful of habits (regular sleep, daily movement, mostly whole foods, managing stress, staying connected and not smoking) with healthier ageing across many systems at once.',
    levers: ['Pick one system and explore it', 'Notice which habits repeat', 'Read the numbers as trends, not verdicts'],
  },
  heart: {
    sys: 'SYS 01 · Cardiovascular', title: 'Heart & circulation',
    tag: 'A fist-sized pump and a vast branching network of vessels, working without a break from before birth.',
    kpis: [['Resting heart rate', '58', 'bpm', 'Sample'], ['Heart-rate variability', '62', 'ms', 'Sample'], ['Zone 2 minutes', '148', '/wk', 'Sample']],
    chart: { type: 'line', cap: 'Resting heart rate over 12 weeks', unit: 'bpm', yMin: 50, yMax: 70, from: 64, to: 58, n: 12, noise: 1.2, xl: ['Wk 1', 'Wk 6', 'Wk 12'] },
    research: 'Regular aerobic activity, not smoking, good sleep and a mostly whole-food diet are consistently associated with better cardiovascular health in large studies. Resting heart rate tends to fall as aerobic fitness improves.',
    levers: ['Moderate activity on most days. WHO guidance for adults is 150–300 minutes a week', 'Regular sleep on a consistent schedule', 'Not smoking, and keeping alcohol low'],
  },
  lungs: {
    sys: 'SYS 02 · Respiratory', title: 'Lungs & fitness',
    tag: 'Around 20,000 breaths a day move oxygen in and carbon dioxide out, almost always without a thought.',
    kpis: [['VO₂ max estimate', '42', 'ml/kg/min', 'Sample'], ['Breathing rate, asleep', '14', '/min', 'Sample'], ['Vigorous minutes', '45', '/wk', 'Sample']],
    chart: { type: 'line', cap: 'Estimated cardiorespiratory fitness (VO₂ max) over 26 weeks', unit: 'ml/kg/min', yMin: 34, yMax: 46, from: 38, to: 42, n: 26, noise: 0.5, xl: ['Wk 1', 'Wk 13', 'Wk 26'] },
    research: 'Cardiorespiratory fitness, often estimated as VO₂ max, is one of the measures most strongly associated with healthy ageing in observational research. It responds to training at almost any age.',
    levers: ['Some vigorous effort each week: hills, intervals, a brisk climb', 'Clean air where possible, and not smoking', 'Building up gradually rather than all at once'],
  },
  brain: {
    sys: 'SYS 03 · Nervous', title: 'Brain & nerves',
    tag: 'About 2% of body weight, yet it uses roughly a fifth of the body’s energy at rest.',
    kpis: [['Sleep last night', '7.4', 'h', 'Sample'], ['Reaction time', '312', 'ms', 'Sample'], ['Focus blocks today', '3', '', 'Sample']],
    chart: { type: 'scatter', cap: 'Sleep duration and next-day reaction time over 24 days' },
    research: 'Sleep, physical activity and social connection are among the factors most often linked with brain health in later life. In the short term, a poor night measurably slows reaction time for many people.',
    levers: ['Protecting sleep, especially its regularity', 'Moving every day: the brain benefits too', 'Staying socially and mentally engaged'],
  },
  muscles: {
    sys: 'SYS 04 · Musculoskeletal', title: 'Muscle & strength',
    tag: 'More than 600 skeletal muscles. They move you, steady you and take up glucose after meals.',
    kpis: [['Strength sessions', '2', '/wk', 'Sample'], ['Grip strength', '38', 'kg', 'Sample'], ['Daily steps', '8,400', '', 'Sample']],
    chart: { type: 'bars', cap: 'Weekly working sets by muscle group', rows: [['Legs', 12], ['Back', 10], ['Chest', 8], ['Shoulders', 6], ['Arms', 6], ['Core', 9]] },
    research: 'Muscle mass and strength decline naturally with age, and resistance training slows that decline at any age. Grip strength is widely used in research as a simple marker of overall strength.',
    levers: ['Muscle-strengthening work on two or more days a week (WHO guidance)', 'Enough protein, spread across the day', 'Balance practice as the years go by'],
  },
  sleep: {
    sys: 'SYS 05 · Circadian', title: 'Sleep & the body clock',
    tag: 'A master clock in the hypothalamus keeps a roughly 24-hour rhythm, reset every day by light.',
    kpis: [['Time asleep', '7h 24', 'm', 'Sample'], ['Sleep regularity', '86', '/100', 'Sample'], ['Deep sleep', '1h 12', 'm', 'Sample']],
    chart: { type: 'hypno', cap: 'Sleep stages through one night' },
    research: 'Expert consensus statements recommend seven or more hours of sleep a night for most adults. Regular timing appears to matter alongside total duration.',
    levers: ['A consistent wake time, weekends included', 'Bright light in the morning, dimmer light at night', 'A cool, dark and quiet room'],
  },
  metabolism: {
    sys: 'SYS 06 · Metabolic', title: 'Metabolism & energy',
    tag: 'The liver, gut, pancreas and muscles turn food into usable energy and keep blood glucose in range.',
    kpis: [['Average glucose', '5.4', 'mmol/L', 'Sample'], ['Meals logged', '3', '', 'Sample'], ['Post-meal walks', '2', '', 'Sample']],
    chart: { type: 'glucose', cap: 'Glucose across one day, with meals marked' },
    research: 'Regular movement, sleep and the overall quality of the diet are all associated with healthier blood glucose regulation. Responses to the same meal can differ widely from person to person.',
    levers: ['A short walk after meals', 'Mostly whole, high-fibre foods', 'Strength work, because muscle takes up glucose'],
  },
};

export const LEVERS = [
  { name: 'Regular sleep', v: [1, 0, 2, 1, 2, 2], text: 'Consistent timing and enough hours. Research links it with mood, memory, appetite regulation and recovery.' },
  { name: 'Daily movement', v: [2, 2, 2, 2, 1, 2], text: 'The habit that touches everything. Walking counts, and so does carrying the shopping up the stairs.' },
  { name: 'Whole-food eating', v: [2, 0, 1, 1, 1, 2], text: 'Mostly plants, fibre and minimally processed food. Associated with heart and metabolic health in large studies.' },
  { name: 'Recovery & stress', v: [2, 0, 2, 1, 2, 1], text: 'Rest days, breathing space and time outdoors. Long-running stress tends to show up in sleep and heart-rate data.' },
  { name: 'Social connection', v: [1, 0, 2, 0, 1, 0], text: 'Loneliness is associated with poorer health in many studies. Connection is a health habit too.' },
  { name: 'Not smoking', v: [2, 2, 1, 0, 1, 1], text: 'The clearest single lever for lungs and heart. Public health bodies report benefits beginning soon after stopping.' },
];

export const METRICS = {
  rhr: { label: 'Resting heart rate', unit: 'bpm', dec: 0, base: 58, noise: 2.6, drift: -2, event: 6, band: [54, 63], yMin: 48, yMax: 70,
    text: 'Usually measured during sleep or first thing in the morning. A single high reading after a late dinner means little; a rise that lasts several days is worth noticing.' },
  hrv: { label: 'Heart-rate variability', unit: 'ms', dec: 0, base: 60, noise: 8, drift: 3, event: -16, band: [48, 74], yMin: 30, yMax: 90,
    text: 'The small variation in time between heartbeats. It is very personal and very noisy, so compare yourself only with yourself, and only over weeks.' },
  sleep: { label: 'Sleep duration', unit: 'h', dec: 1, base: 7.1, noise: 0.55, drift: 0.2, event: -0.8, band: [6.4, 8], yMin: 5, yMax: 9,
    text: 'Night-to-night swings of an hour are common. The weekly average and the regularity of your timing tell you far more than any single night.' },
};

/* deterministic pseudo-random numbers so sample data is stable between visits */
export function rng(seed = 1) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
