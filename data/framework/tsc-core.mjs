// Technical Skills and Competencies (TSC): proficiency ladder and cross-sector catalogue.
// TSCs are assessed on a six-level ladder; not every TSC spans all six levels.

export const tscLadder = [
  { level: 1, name: 'Level 1: Follow',
    autonomy: 'Works under close supervision within clearly defined procedures.',
    complexity: 'Routine tasks with predictable inputs.',
    template: 'Assist with {focus} under close supervision, following documented procedures.' },
  { level: 2, name: 'Level 2: Apply',
    autonomy: 'Works with limited supervision on defined tasks.',
    complexity: 'Standard tasks with occasional variation.',
    template: 'Handle {focus} for routine cases with limited supervision, applying established standards.' },
  { level: 3, name: 'Level 3: Evaluate',
    autonomy: 'Works independently and checks the work of others.',
    complexity: 'Complex or non-standard cases requiring judgement.',
    template: 'Take responsibility for {focus} in complex or non-standard cases, exercising judgement and guiding less experienced staff.' },
  { level: 4, name: 'Level 4: Manage',
    autonomy: 'Accountable for a function or workstream and the people in it.',
    complexity: 'Ambiguous problems spanning several teams.',
    template: 'Manage {focus} across a function, resolving escalations and setting local standards and controls.' },
  { level: 5, name: 'Level 5: Lead',
    autonomy: 'Accountable for the domain across the organisation.',
    complexity: 'Strategic problems with material risk and investment.',
    template: 'Lead {focus} across the organisation, setting strategy, standards and capability plans.' },
  { level: 6, name: 'Level 6: Direct',
    autonomy: 'Sets direction beyond the organisation; recognised authority.',
    complexity: 'Novel, unbounded problems shaping industry practice.',
    template: 'Set direction for {focus} at organisational and industry level, pioneering practice others adopt.' },
];

// Accent clauses add sector-specific texture to each generated level descriptor.
export const categoryAccents = {
  'Data and Analytics': ['on prepared datasets', 'against agreed data quality rules', 'where sources conflict or are incomplete', 'across the function’s data estate', 'as an enterprise data capability', 'as a national or industry data practice'],
  'Software and Platforms': ['on well-specified tickets', 'within an existing service', 'across services with shared dependencies', 'for a platform used by other teams', 'across the engineering organisation', 'as reference practice for the industry'],
  'Security and Resilience': ['following a runbook', 'against a defined control set', 'where the threat is novel', 'across the control environment', 'as an enterprise risk posture', 'shaping sector-wide standards'],
  'Operations and Delivery': ['on a single shift or task', 'for a defined process', 'when the process breaks down', 'across an operating unit', 'across the operating model', 'setting the benchmark for the sector'],
  'Engineering and Technical': ['on components under supervision', 'to specification', 'where specification is incomplete', 'for a system or asset class', 'across the asset portfolio', 'advancing engineering practice'],
  'Governance and Assurance': ['completing prescribed checks', 'applying the control framework', 'where judgement on materiality is needed', 'over a control domain', 'over the assurance framework', 'influencing regulatory expectation'],
  'Commercial and Customer': ['on defined accounts or transactions', 'within agreed commercial terms', 'in contested or high-value situations', 'for a portfolio or market', 'for the commercial strategy', 'shaping how the market operates'],
  'People and Organisation': ['for individual cases', 'for a defined population', 'where policy and practice conflict', 'for a business unit', 'for the whole organisation', 'shaping national practice'],
  'Sustainability and Compliance': ['collecting prescribed evidence', 'against a recognised standard', 'where methodology must be selected and defended', 'across a reporting boundary', 'across the enterprise and value chain', 'contributing to standard-setting bodies'],
  'Design and Content': ['to a supplied brief', 'within an established system', 'where the brief is unclear or contested', 'across a product or portfolio', 'across the brand and portfolio', 'defining practice others follow'],
  'Care and Clinical': ['under direct supervision', 'within scope of practice', 'for complex or atypical presentations', 'for a service or ward', 'across a care network', 'advancing clinical practice'],
  'Learning and Development': ['delivering prepared material', 'for a defined programme', 'where learner needs vary widely', 'across a curriculum', 'across the learning strategy', 'shaping adult learning practice'],
};

const mk = (sector, category, rows) =>
  rows.map(([code, title, focus, minLevel = 1, maxLevel = 6]) =>
    ({ code, sector, category, title, focus, minLevel, maxLevel }));

// ---------------------------------------------------------------------------
// Cross-sector TSCs: recognised in every Skills Framework.
// ---------------------------------------------------------------------------
export const crossSectorTscs = [
  ...mk(null, 'Data and Analytics', [
    ['X-DAT-001', 'Data Literacy', 'reading, questioning and communicating data in day-to-day decisions', 1, 4],
    ['X-DAT-002', 'Business Intelligence Reporting', 'building and maintaining reports and dashboards for business users', 1, 5],
    ['X-DAT-003', 'Statistical Analysis', 'applying statistical methods to answer defined business questions', 2, 6],
    ['X-DAT-004', 'Data Governance', 'defining and enforcing standards for data quality, lineage and access', 3, 6],
  ]),
  ...mk(null, 'Software and Platforms', [
    ['X-SWP-001', 'Digital Workplace Tools', 'using collaboration, document and workflow tools to get work done', 1, 3],
    ['X-SWP-002', 'Process Automation', 'automating repetitive process steps with low-code or scripted tooling', 1, 5],
    ['X-SWP-003', 'Artificial Intelligence Application', 'applying AI tools and models responsibly to real work tasks', 1, 6],
  ]),
  ...mk(null, 'Security and Resilience', [
    ['X-SEC-001', 'Cyber Hygiene', 'applying everyday security practice to protect systems and information', 1, 3],
    ['X-SEC-002', 'Personal Data Protection', 'handling personal data in line with the Personal Data Protection Act', 1, 5],
    ['X-SEC-003', 'Business Continuity Management', 'preparing for and recovering from disruption to critical operations', 2, 6],
  ]),
  ...mk(null, 'Operations and Delivery', [
    ['X-OPS-001', 'Process Improvement', 'analysing and improving how work flows through a process', 2, 6],
    ['X-OPS-002', 'Project Management', 'planning, running and closing projects to time, cost and quality', 2, 6],
    ['X-OPS-003', 'Vendor Management', 'selecting and managing suppliers against commercial and service terms', 2, 5],
    ['X-OPS-004', 'Workplace Safety and Health', 'identifying hazards and applying controls under the WSH Act', 1, 6],
  ]),
  ...mk(null, 'Governance and Assurance', [
    ['X-GOV-001', 'Risk Management', 'identifying, assessing and treating risk within an agreed appetite', 2, 6],
    ['X-GOV-002', 'Regulatory Compliance', 'meeting the regulatory obligations that apply to the business', 2, 6],
    ['X-GOV-003', 'Internal Controls', 'designing and operating controls that keep processes reliable', 2, 5],
  ]),
  ...mk(null, 'Commercial and Customer', [
    ['X-COM-001', 'Stakeholder Management', 'building and sustaining working relationships that get outcomes', 2, 6],
    ['X-COM-002', 'Budgeting and Cost Control', 'planning and controlling spend against a budget', 2, 5],
    ['X-COM-003', 'Negotiation', 'reaching agreements that hold and protect the organisation’s position', 2, 6],
  ]),
  ...mk(null, 'People and Organisation', [
    ['X-PPL-001', 'Performance Management', 'setting expectations, giving feedback and managing performance', 3, 6],
    ['X-PPL-002', 'Workforce Planning', 'matching people supply and capability to future demand', 3, 6],
    ['X-PPL-003', 'Change Management', 'preparing and carrying people through operational change', 3, 6],
  ]),
  ...mk(null, 'Sustainability and Compliance', [
    ['X-SUS-001', 'Sustainability Literacy', 'understanding how climate and resource pressures affect the business', 1, 4],
    ['X-SUS-002', 'Greenhouse Gas Accounting', 'measuring and reporting emissions across defined scopes', 2, 6],
    ['X-SUS-003', 'Circular Economy Practice', 'designing out waste and keeping materials in productive use', 2, 5],
  ]),
];
