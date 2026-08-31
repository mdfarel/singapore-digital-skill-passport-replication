// Sector-specific TSCs, part 2 (Financial Services through Precision Engineering).
const mk = (sector, category, rows) =>
  rows.map(([code, title, focus, minLevel = 1, maxLevel = 6]) =>
    ({ code, sector, category, title, focus, minLevel, maxLevel }));

export const tscsB = [
  ...mk('FIN', 'Governance and Assurance', [
    ['FIN-001', 'Credit Risk Management', 'assessing and managing credit exposure across counterparties and portfolios', 2, 6],
    ['FIN-002', 'Market Risk Management', 'measuring and controlling market risk within approved limits', 3, 6],
    ['FIN-003', 'Operational Risk Management', 'identifying and mitigating operational risk across the business', 2, 6],
    ['FIN-004', 'Anti-Money Laundering Compliance', 'applying AML and countering-terrorism-financing obligations', 2, 6],
    ['FIN-005', 'Regulatory Reporting', 'preparing and submitting regulatory returns accurately and on time', 2, 5],
  ]),
  ...mk('FIN', 'Commercial and Customer', [
    ['FIN-006', 'Relationship Management', 'owning client relationships across their financial needs', 2, 6],
    ['FIN-007', 'Wealth Advisory', 'advising clients on portfolio construction and financial planning', 3, 6],
    ['FIN-008', 'Trade Finance Operations', 'processing and structuring trade finance instruments', 2, 5],
    ['FIN-009', 'Insurance Underwriting', 'pricing and accepting insurance risk within underwriting authority', 2, 6],
    ['FIN-010', 'Claims Management', 'assessing and settling claims fairly, quickly and within policy', 1, 5],
  ]),
  ...mk('FIN', 'Data and Analytics', [
    ['FIN-011', 'Quantitative Modelling', 'building and validating quantitative models for pricing and risk', 3, 6],
    ['FIN-012', 'Financial Crime Analytics', 'detecting financial crime patterns using data and typologies', 2, 6],
    ['FIN-013', 'Digital Banking Product Management', 'running digital financial products from proposition to performance', 3, 6],
  ]),
  ...mk('FMF', 'Operations and Delivery', [
    ['FMF-001', 'Food Processing Operations', 'operating food processing lines to yield, quality and safety targets', 1, 5],
    ['FMF-002', 'Food Manufacturing Automation', 'commissioning and running automated food production equipment', 2, 5],
    ['FMF-003', 'Production Planning', 'planning production against demand, shelf life and capacity', 2, 5],
  ]),
  ...mk('FMF', 'Governance and Assurance', [
    ['FMF-004', 'Food Safety and HACCP', 'designing and operating HACCP-based food safety systems', 2, 6],
    ['FMF-005', 'Food Labelling and Regulatory Compliance', 'meeting labelling, claims and food regulation requirements', 2, 5],
    ['FMF-006', 'Halal and Certification Compliance', 'maintaining halal and other certification requirements in production', 2, 5],
  ]),
  ...mk('FMF', 'Design and Content', [
    ['FMF-007', 'Food Product Innovation', 'developing new food products from bench to scale-up', 2, 6],
    ['FMF-008', 'Sensory Evaluation', 'designing and interpreting sensory panels for product decisions', 2, 5],
  ]),
  ...mk('FSV', 'Operations and Delivery', [
    ['FSV-001', 'Culinary Practice', 'preparing and executing dishes to recipe, cost and consistency', 1, 6],
    ['FSV-002', 'Kitchen Operations Management', 'running kitchen operations across station, flow, cost and hygiene', 2, 6],
    ['FSV-003', 'Restaurant Service Operations', 'delivering front-of-house service to standard through a service period', 1, 5],
    ['FSV-004', 'Food and Beverage Cost Control', 'controlling food cost, wastage and menu profitability', 2, 5],
  ]),
  ...mk('FSV', 'Governance and Assurance', [
    ['FSV-005', 'Food Hygiene Management', 'maintaining hygiene standards and licensing compliance in food premises', 1, 5],
  ]),
  ...mk('FSV', 'Commercial and Customer', [
    ['FSV-006', 'Menu Engineering', 'designing menus around margin, demand and operational capability', 3, 6],
    ['FSV-007', 'Food Service Technology', 'deploying ordering, kitchen display and delivery platform technology', 2, 5],
  ]),
  ...mk('HLT', 'Care and Clinical', [
    ['HLT-001', 'Nursing Practice', 'delivering nursing care within scope of practice and clinical protocols', 1, 6],
    ['HLT-002', 'Patient Assessment', 'assessing patients and escalating deterioration accurately', 1, 6],
    ['HLT-003', 'Medication Management', 'preparing, administering and reconciling medication safely', 1, 5],
    ['HLT-004', 'Allied Health Intervention', 'delivering therapy interventions against assessed functional goals', 2, 6],
    ['HLT-005', 'Infection Prevention and Control', 'applying and enforcing infection prevention practice', 1, 6],
    ['HLT-006', 'Community and Home Care', 'delivering care in home and community settings with limited backup', 2, 5],
  ]),
  ...mk('HLT', 'Data and Analytics', [
    ['HLT-007', 'Health Informatics', 'using clinical systems and coded data to support care and reporting', 2, 6],
    ['HLT-008', 'Clinical Quality Improvement', 'running improvement cycles against clinical outcome measures', 3, 6],
  ]),
  ...mk('HLT', 'Governance and Assurance', [
    ['HLT-009', 'Clinical Governance', 'operating clinical governance, incident review and standards compliance', 3, 6],
    ['HLT-010', 'Care Coordination', 'coordinating care across providers and settings for complex patients', 2, 6],
  ]),
  ...mk('HAS', 'Operations and Delivery', [
    ['HAS-001', 'Rooms Division Operations', 'running front office and housekeeping to occupancy and service targets', 1, 6],
    ['HAS-002', 'Hotel Revenue Management', 'setting rates and inventory across channels to maximise RevPAR', 3, 6],
    ['HAS-003', 'Guest Experience Management', 'designing and recovering the guest experience across touchpoints', 2, 6],
    ['HAS-004', 'Hospitality Asset Maintenance', 'maintaining property assets and engineering systems in service', 1, 5],
  ]),
  ...mk('HAS', 'Commercial and Customer', [
    ['HAS-005', 'Distribution Channel Management', 'managing OTA, direct and corporate distribution mix and cost', 3, 6],
    ['HAS-006', 'Events and Banqueting', 'selling and delivering events and banquet operations', 2, 5],
  ]),
  ...mk('HRE', 'People and Organisation', [
    ['HRE-001', 'Talent Acquisition', 'attracting, assessing and hiring against real capability requirements', 2, 6],
    ['HRE-002', 'Total Rewards', 'designing and administering pay, benefits and incentive structures', 2, 6],
    ['HRE-003', 'Employee Relations', 'handling grievance, discipline and workplace conflict lawfully', 2, 6],
    ['HRE-004', 'Learning and Capability Development', 'building capability plans and learning interventions that change practice', 2, 6],
    ['HRE-005', 'Organisation Development', 'designing structures, roles and ways of working for effectiveness', 3, 6],
    ['HRE-006', 'Skills-Based Job Redesign', 'redesigning jobs around skills so roles are open to more candidates', 3, 6],
  ]),
  ...mk('HRE', 'Data and Analytics', [
    ['HRE-007', 'HR Analytics', 'analysing workforce data to answer people and business questions', 2, 6],
    ['HRE-008', 'Skills Taxonomy Management', 'building and maintaining a skills taxonomy mapped to the national framework', 3, 6],
  ]),
  ...mk('HRE', 'Governance and Assurance', [
    ['HRE-009', 'Employment Law Compliance', 'applying the Employment Act, work pass and fair consideration rules', 2, 6],
    ['HRE-010', 'HR Technology Management', 'selecting and operating HRIS and people technology', 2, 5],
  ]),
  ...mk('ICT', 'Software and Platforms', [
    ['ICT-001', 'Software Engineering', 'designing, building and maintaining production software', 1, 6],
    ['ICT-002', 'Site Reliability Engineering', 'keeping services reliable through observability, automation and error budgets', 3, 6],
    ['ICT-003', 'Cloud Architecture', 'designing cloud platforms for cost, resilience and security', 3, 6],
    ['ICT-004', 'DevSecOps', 'running secure, automated build and deployment pipelines', 2, 6],
    ['ICT-005', 'API and Integration Design', 'designing interfaces and integration between systems', 2, 6],
    ['ICT-006', 'Test Engineering', 'designing and automating tests that catch defects before release', 1, 5],
  ]),
  ...mk('ICT', 'Data and Analytics', [
    ['ICT-007', 'Data Engineering', 'building and operating pipelines that deliver trustworthy data', 2, 6],
    ['ICT-008', 'Machine Learning Engineering', 'training, deploying and monitoring machine learning models in production', 3, 6],
    ['ICT-009', 'Applied AI and Generative Systems', 'building applications on foundation models with evaluation and guardrails', 2, 6],
    ['ICT-010', 'Data Science', 'framing business problems as analyses and defending the conclusions', 2, 6],
  ]),
  ...mk('ICT', 'Security and Resilience', [
    ['ICT-011', 'Security Operations', 'detecting, triaging and responding to security incidents', 2, 6],
    ['ICT-012', 'Security Architecture', 'designing controls and architecture that resist real attack paths', 3, 6],
    ['ICT-013', 'Penetration Testing', 'testing systems adversarially and reporting exploitable weakness', 3, 6],
    ['ICT-014', 'Identity and Access Management', 'designing and operating identity, authentication and entitlement', 2, 6],
  ]),
  ...mk('ICT', 'Operations and Delivery', [
    ['ICT-015', 'Product Management', 'owning a digital product’s problem, roadmap and outcomes', 3, 6],
    ['ICT-016', 'IT Service Management', 'running incident, problem and change processes to agreed service levels', 1, 5],
    ['ICT-017', 'Enterprise Architecture', 'setting technology standards and the target-state architecture', 4, 6],
  ]),
  ...mk('IPR', 'Governance and Assurance', [
    ['IPR-001', 'IP Portfolio Management', 'building and maintaining a patent, trademark and design portfolio', 3, 6],
    ['IPR-002', 'Patent Drafting and Prosecution', 'drafting applications and prosecuting them through examination', 3, 6],
    ['IPR-003', 'IP Enforcement', 'detecting infringement and running enforcement and dispute strategy', 3, 6],
    ['IPR-004', 'Freedom-to-Operate Analysis', 'analysing third-party rights before commercial launch', 3, 6],
  ]),
  ...mk('IPR', 'Commercial and Customer', [
    ['IPR-005', 'IP Valuation', 'valuing intangible assets for transaction, financing or reporting', 4, 6],
    ['IPR-006', 'Licensing and Technology Transfer', 'structuring licences and technology transfer arrangements', 3, 6],
    ['IPR-007', 'IP Strategy', 'aligning IP creation and protection with commercial strategy', 4, 6],
  ]),
  ...mk('LND', 'Engineering and Technical', [
    ['LND-001', 'Landscape Design', 'designing planted and hardscape environments for use and ecology', 3, 6],
    ['LND-002', 'Horticulture Practice', 'establishing and maintaining plant health across species and settings', 1, 5],
    ['LND-003', 'Arboriculture', 'inspecting, pruning and managing trees for health and public safety', 2, 6],
    ['LND-004', 'Irrigation and Soil Management', 'managing soil, drainage and irrigation for plant performance', 1, 5],
  ]),
  ...mk('LND', 'Sustainability and Compliance', [
    ['LND-005', 'Biodiversity and Habitat Management', 'managing habitat and biodiversity outcomes in built landscapes', 3, 6],
    ['LND-006', 'Landscape Maintenance Operations', 'planning and supervising maintenance regimes and crews', 1, 5],
  ]),
  ...mk('LEG', 'Governance and Assurance', [
    ['LEG-001', 'Legal Research and Advice', 'researching and advising on the law applicable to a matter', 2, 6],
    ['LEG-002', 'Contract Drafting and Negotiation', 'drafting and negotiating commercial agreements', 2, 6],
    ['LEG-003', 'Dispute Resolution', 'running litigation, arbitration and mediation strategy', 3, 6],
    ['LEG-004', 'Regulatory and Compliance Advisory', 'advising the business on regulatory obligations and exposure', 3, 6],
  ]),
  ...mk('LEG', 'Operations and Delivery', [
    ['LEG-005', 'Legal Operations', 'running matter management, spend and process in a legal function', 2, 5],
    ['LEG-006', 'Legal Technology Application', 'applying document automation, e-discovery and AI review tooling', 2, 5],
  ]),
  ...mk('LOG', 'Operations and Delivery', [
    ['LOG-001', 'Warehouse Operations', 'running receiving, storage, picking and despatch to service levels', 1, 5],
    ['LOG-002', 'Freight Forwarding', 'arranging multimodal freight, documentation and customs clearance', 1, 5],
    ['LOG-003', 'Supply Chain Planning', 'planning demand, inventory and replenishment across the network', 2, 6],
    ['LOG-004', 'Last-Mile Delivery Operations', 'planning and running last-mile fleet, routing and delivery performance', 1, 5],
    ['LOG-005', 'Cold Chain Management', 'maintaining temperature integrity across storage and transport', 2, 5],
  ]),
  ...mk('LOG', 'Data and Analytics', [
    ['LOG-006', 'Logistics Automation', 'deploying and running automated storage, sortation and robotics', 2, 6],
    ['LOG-007', 'Supply Chain Analytics', 'analysing network, cost and service performance to drive decisions', 2, 6],
    ['LOG-008', 'Trade Compliance', 'meeting customs, sanctions and controlled goods obligations', 2, 6],
  ]),
  ...mk('MAO', 'Engineering and Technical', [
    ['MAO-001', 'Marine Structural Fabrication', 'fabricating and assembling marine and offshore steel structures', 1, 5],
    ['MAO-002', 'Marine Welding', 'welding to marine class standards across positions and processes', 1, 5],
    ['MAO-003', 'Naval Architecture', 'designing hull form, stability and structure to class rules', 3, 6],
    ['MAO-004', 'Marine Systems Engineering', 'designing and commissioning propulsion, piping and marine systems', 2, 6],
    ['MAO-005', 'Ship Repair Project Management', 'planning and delivering repair and conversion projects in dock', 3, 6],
  ]),
  ...mk('MAO', 'Governance and Assurance', [
    ['MAO-006', 'Class and Statutory Compliance', 'meeting classification society and flag state requirements', 3, 6],
    ['MAO-007', 'Marine Quality and Inspection', 'inspecting and accepting fabrication and coating work', 2, 5],
  ]),
  ...mk('MED', 'Design and Content', [
    ['MED-001', 'Content Production', 'producing video, audio and written content to brief and standard', 1, 6],
    ['MED-002', 'Post-Production and VFX', 'editing, grading and compositing to delivery specification', 2, 6],
    ['MED-003', 'Games Development', 'building interactive experiences across design, art and engineering', 2, 6],
    ['MED-004', 'Immersive Media Production', 'producing AR, VR and virtual production content', 3, 6],
    ['MED-005', 'Editorial and Journalism', 'reporting, verifying and publishing to editorial standards', 2, 6],
  ]),
  ...mk('MED', 'Commercial and Customer', [
    ['MED-006', 'Content Distribution and Monetisation', 'distributing content across platforms and converting audience to revenue', 3, 6],
    ['MED-007', 'Audience Analytics', 'measuring audience behaviour and feeding it back into commissioning', 2, 5],
  ]),
  ...mk('PRE', 'Engineering and Technical', [
    ['PRE-001', 'Precision Machining', 'machining to tight tolerance on CNC and conventional equipment', 1, 5],
    ['PRE-002', 'Tool and Die Making', 'designing and making tools, dies and moulds to production requirements', 2, 6],
    ['PRE-003', 'Metrology and Inspection', 'measuring and verifying parts against drawing and GD&T', 1, 5],
    ['PRE-004', 'Additive Manufacturing', 'producing qualified parts by additive processes', 2, 6],
    ['PRE-005', 'Automation Systems Engineering', 'designing and integrating automated production cells', 3, 6],
    ['PRE-006', 'CAD/CAM Programming', 'programming toolpaths and fixturing from 3D models', 2, 5],
  ]),
  ...mk('PRE', 'Operations and Delivery', [
    ['PRE-007', 'Lean Manufacturing', 'removing waste and variation from manufacturing flow', 2, 6],
    ['PRE-008', 'Production Quality Management', 'operating quality systems across incoming, in-process and final inspection', 2, 6],
  ]),
];
