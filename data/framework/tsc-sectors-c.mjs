// Sector-specific TSCs, part 3 (Public Transport through Wholesale Trade).
const mk = (sector, category, rows) =>
  rows.map(([code, title, focus, minLevel = 1, maxLevel = 6]) =>
    ({ code, sector, category, title, focus, minLevel, maxLevel }));

export const tscsC = [
  ...mk('PTR', 'Operations and Delivery', [
    ['PTR-001', 'Rail Operations Control', 'controlling train service and recovering from disruption', 2, 6],
    ['PTR-002', 'Bus Service Operations', 'running bus service delivery to headway and reliability targets', 1, 5],
    ['PTR-003', 'Transport Service Planning', 'planning routes, frequencies and capacity against demand', 3, 6],
    ['PTR-004', 'Depot and Fleet Management', 'managing fleet availability, maintenance slots and depot flow', 2, 5],
  ]),
  ...mk('PTR', 'Engineering and Technical', [
    ['PTR-005', 'Rail Systems Maintenance', 'maintaining rolling stock, track, power and signalling assets', 1, 6],
    ['PTR-006', 'Signalling and Train Control', 'maintaining and commissioning signalling and train control systems', 3, 6],
    ['PTR-007', 'Transport Asset Reliability', 'raising asset reliability through condition monitoring and analytics', 3, 6],
  ]),
  ...mk('PTR', 'Governance and Assurance', [
    ['PTR-008', 'Rail Safety Assurance', 'operating safety assurance and incident investigation for rail systems', 3, 6],
  ]),
  ...mk('RET', 'Commercial and Customer', [
    ['RET-001', 'Retail Selling and Service', 'converting and serving customers on the shop floor', 1, 4],
    ['RET-002', 'Visual Merchandising', 'presenting product to drive attention, trial and basket size', 1, 5],
    ['RET-003', 'Category and Buying Management', 'selecting, negotiating and managing product ranges and margin', 3, 6],
    ['RET-004', 'E-Commerce Operations', 'running online storefront, listings, fulfilment and returns', 2, 5],
    ['RET-005', 'Omni-Channel Customer Experience', 'joining store, online and service channels into one experience', 3, 6],
  ]),
  ...mk('RET', 'Operations and Delivery', [
    ['RET-006', 'Store Operations Management', 'running a store across people, stock, cash, compliance and performance', 2, 6],
    ['RET-007', 'Inventory and Replenishment', 'holding the right stock at the right place without excess', 2, 5],
    ['RET-008', 'Retail Analytics', 'analysing sales, traffic and basket data to drive trading decisions', 2, 6],
  ]),
  ...mk('SEA', 'Operations and Delivery', [
    ['SEA-001', 'Ship Management', 'managing vessel technical, crewing and operational performance', 3, 6],
    ['SEA-002', 'Port and Terminal Operations', 'planning and running vessel, yard and gate operations', 2, 6],
    ['SEA-003', 'Bunkering Operations', 'delivering marine fuel safely and to quantity and quality standards', 2, 5],
    ['SEA-004', 'Marine Cargo Operations', 'planning and supervising loading, stowage and discharge', 2, 5],
  ]),
  ...mk('SEA', 'Commercial and Customer', [
    ['SEA-005', 'Chartering and Freight Trading', 'fixing vessels and managing freight exposure', 3, 6],
    ['SEA-006', 'Marine Insurance and Claims', 'placing marine cover and handling casualty and cargo claims', 3, 6],
  ]),
  ...mk('SEA', 'Sustainability and Compliance', [
    ['SEA-007', 'Maritime Regulatory Compliance', 'meeting IMO, flag and port state requirements including emissions rules', 3, 6],
    ['SEA-008', 'Alternative Marine Fuels', 'preparing operations for methanol, ammonia and other low-carbon fuels', 3, 6],
  ]),
  ...mk('SEC', 'Operations and Delivery', [
    ['SEC-001', 'Security Officer Operations', 'performing access control, patrol and incident response duties', 1, 4],
    ['SEC-002', 'Security Command Centre Operations', 'monitoring, correlating and directing response from a command centre', 2, 5],
    ['SEC-003', 'Security Systems Technology', 'specifying and operating video analytics, access and sensor systems', 2, 6],
    ['SEC-004', 'Crowd and Event Security', 'planning and delivering security for crowded places and events', 2, 6],
  ]),
  ...mk('SEC', 'Governance and Assurance', [
    ['SEC-005', 'Security Risk Assessment', 'assessing threat, vulnerability and consequence for a protected site', 3, 6],
    ['SEC-006', 'Security Regulatory Compliance', 'meeting private security industry licensing and deployment rules', 2, 5],
  ]),
  ...mk('SSV', 'Care and Clinical', [
    ['SSV-001', 'Social Case Management', 'assessing need and managing a case through to stable outcome', 2, 6],
    ['SSV-002', 'Counselling Practice', 'delivering counselling interventions within professional boundaries', 3, 6],
    ['SSV-003', 'Group and Community Work', 'designing and facilitating group and community-level intervention', 2, 6],
    ['SSV-004', 'Crisis Intervention', 'responding to crisis and risk of harm with appropriate escalation', 2, 6],
  ]),
  ...mk('SSV', 'People and Organisation', [
    ['SSV-005', 'Programme Design and Evaluation', 'designing programmes and evaluating whether they actually work', 3, 6],
    ['SSV-006', 'Volunteer Management', 'recruiting, deploying and retaining volunteers effectively', 2, 5],
    ['SSV-007', 'Social Service Fundraising', 'raising and stewarding funds for social service delivery', 3, 6],
  ]),
  ...mk('TOU', 'Commercial and Customer', [
    ['TOU-001', 'Attraction Operations', 'running attraction admissions, flow, safety and guest experience', 1, 5],
    ['TOU-002', 'MICE Event Management', 'planning and delivering business events end to end', 2, 6],
    ['TOU-003', 'Travel Product Development', 'building and pricing itineraries and travel products', 2, 5],
    ['TOU-004', 'Destination Marketing', 'positioning and promoting a destination to target segments', 3, 6],
    ['TOU-005', 'Tour Guiding', 'delivering licensed guided experiences with accurate interpretation', 1, 4],
  ]),
  ...mk('TOU', 'Sustainability and Compliance', [
    ['TOU-006', 'Sustainable Tourism Practice', 'reducing the environmental and social footprint of tourism operations', 2, 6],
  ]),
  ...mk('TAE', 'Learning and Development', [
    ['TAE-001', 'Curriculum Design', 'designing curriculum and learning outcomes for adult learners', 3, 6],
    ['TAE-002', 'Learning Facilitation', 'facilitating adult learning across modes and group dynamics', 1, 6],
    ['TAE-003', 'Competency Assessment', 'assessing competence against standards with valid evidence', 2, 6],
    ['TAE-004', 'Learning Technology Integration', 'deploying learning platforms, simulation and adaptive tooling', 2, 6],
    ['TAE-005', 'Workplace Learning Design', 'designing on-the-job and structured workplace learning', 3, 6],
    ['TAE-006', 'Learning Evaluation and Impact', 'evaluating learning by capability and business change, not attendance', 3, 6],
  ]),
  ...mk('WHT', 'Commercial and Customer', [
    ['WHT-001', 'Commodity Trading', 'taking and managing positions in physical and paper commodity markets', 3, 6],
    ['WHT-002', 'Trade Structuring', 'structuring trades, financing and risk transfer across the chain', 3, 6],
    ['WHT-003', 'Distribution Channel Development', 'building and managing distributor and reseller networks', 2, 6],
    ['WHT-004', 'Market Development', 'opening and growing new geographic and segment markets', 3, 6],
  ]),
  ...mk('WHT', 'Operations and Delivery', [
    ['WHT-005', 'Trade Operations and Documentation', 'executing trade documentation, settlement and shipment operations', 1, 5],
    ['WHT-006', 'Counterparty Risk Management', 'assessing and limiting exposure to trading counterparties', 3, 6],
  ]),
];
