// Sector-specific TSCs, part 1 (Accountancy through Environmental Services).
const mk = (sector, category, rows) =>
  rows.map(([code, title, focus, minLevel = 1, maxLevel = 6]) =>
    ({ code, sector, category, title, focus, minLevel, maxLevel }));

export const tscsA = [
  ...mk('ACC', 'Governance and Assurance', [
    ['ACC-001', 'Financial Statements Preparation', 'preparing financial statements under SFRS and IFRS', 2, 5],
    ['ACC-002', 'Audit Execution', 'executing audit procedures and documenting sufficient appropriate evidence', 2, 6],
    ['ACC-003', 'Internal Audit', 'planning and running risk-based internal audit engagements', 3, 6],
    ['ACC-004', 'Tax Computation and Filing', 'computing corporate and indirect tax positions and filing returns', 2, 5],
  ]),
  ...mk('ACC', 'Commercial and Customer', [
    ['ACC-005', 'Business Valuation', 'valuing businesses and intangible assets for transactions and reporting', 3, 6],
    ['ACC-006', 'Management Reporting', 'producing management accounts and variance analysis that drive action', 2, 5],
    ['ACC-007', 'Treasury and Cash Management', 'managing liquidity, funding and foreign exchange exposure', 3, 6],
  ]),
  ...mk('ACC', 'Data and Analytics', [
    ['ACC-008', 'Finance Data Analytics', 'analysing finance data to explain performance and detect anomalies', 2, 5],
    ['ACC-009', 'Finance Process Automation', 'automating close, reconciliation and reporting processes', 2, 5],
    ['ACC-010', 'Forensic Accounting', 'investigating financial irregularity and quantifying loss', 3, 6],
  ]),
  ...mk('AER', 'Engineering and Technical', [
    ['AER-001', 'Aircraft Maintenance', 'performing scheduled and unscheduled maintenance on airframes and systems', 1, 5],
    ['AER-002', 'Avionics Systems', 'testing, fault-finding and repairing avionics and electrical systems', 2, 5],
    ['AER-003', 'Engine Overhaul', 'stripping, inspecting and rebuilding turbine engines and modules', 2, 6],
    ['AER-004', 'Non-Destructive Testing', 'applying NDT methods to detect defects without damaging the part', 2, 5],
    ['AER-005', 'Aerostructures Manufacturing', 'manufacturing and assembling composite and metallic aerostructures', 1, 5],
  ]),
  ...mk('AER', 'Governance and Assurance', [
    ['AER-006', 'Airworthiness Management', 'maintaining continuing airworthiness and technical records', 3, 6],
    ['AER-007', 'Aviation Quality Assurance', 'auditing maintenance practice against regulatory approvals', 3, 6],
    ['AER-008', 'Aviation Safety Management', 'operating a safety management system and just-culture reporting', 3, 6],
  ]),
  ...mk('AER', 'Operations and Delivery', [
    ['AER-009', 'MRO Planning and Turnaround', 'planning hangar slots, materials and manpower to hit turnaround targets', 2, 5],
    ['AER-010', 'Aviation Supply Chain', 'managing spares provisioning, AOG response and rotable pools', 2, 5],
  ]),
  ...mk('AGF', 'Engineering and Technical', [
    ['AGF-001', 'Controlled Environment Agriculture', 'operating indoor growing systems for light, climate and nutrition', 1, 5],
    ['AGF-002', 'Aquaculture Operations', 'managing stock health, water quality and yield in aquaculture systems', 1, 5],
    ['AGF-003', 'Crop Science Application', 'applying agronomy to variety selection, nutrition and yield', 2, 6],
    ['AGF-004', 'Agri-Automation and Sensing', 'deploying sensors, robotics and control systems in production', 2, 5],
  ]),
  ...mk('AGF', 'Governance and Assurance', [
    ['AGF-005', 'Food Safety Assurance', 'operating HACCP and food safety systems across production', 2, 6],
    ['AGF-006', 'Biosecurity Management', 'preventing and containing pest and disease incursion', 2, 5],
  ]),
  ...mk('AGF', 'Commercial and Customer', [
    ['AGF-007', 'Agrifood Supply Chain', 'managing cold chain, sourcing and distribution for perishables', 2, 5],
    ['AGF-008', 'Food Product Development', 'taking a food product from concept to commercial production', 2, 5],
  ]),
  ...mk('AIR', 'Operations and Delivery', [
    ['AIR-001', 'Airport Operations', 'running airside and terminal operations to schedule and safety standards', 1, 6],
    ['AIR-002', 'Ground Handling', 'turning aircraft around across ramp, baggage, loading and pushback', 1, 4],
    ['AIR-003', 'Air Cargo Handling', 'accepting, building and tracking air cargo including special loads', 1, 5],
    ['AIR-004', 'Load Control and Weight Balance', 'producing loadsheets and managing aircraft weight and balance', 2, 5],
  ]),
  ...mk('AIR', 'Governance and Assurance', [
    ['AIR-005', 'Aviation Security', 'applying screening and access controls under national aviation security rules', 1, 6],
    ['AIR-006', 'Airside Safety Compliance', 'enforcing airside driving, FOD and apron safety standards', 2, 5],
  ]),
  ...mk('AIR', 'Commercial and Customer', [
    ['AIR-007', 'Airline Revenue Management', 'setting fares and inventory to maximise revenue per available seat', 3, 6],
    ['AIR-008', 'Passenger Experience Delivery', 'delivering the end-to-end passenger journey through the terminal', 1, 5],
  ]),
  ...mk('ART', 'Design and Content', [
    ['ART-001', 'Artistic Practice', 'developing and sustaining a body of original artistic work', 2, 6],
    ['ART-002', 'Production and Stagecraft', 'delivering technical production for performance and exhibition', 1, 5],
    ['ART-003', 'Curation and Programming', 'curating programmes that hold artistic and audience value', 3, 6],
  ]),
  ...mk('ART', 'Commercial and Customer', [
    ['ART-004', 'Audience Development', 'growing and deepening audiences for arts programming', 2, 5],
    ['ART-005', 'Arts Fundraising and Sponsorship', 'securing grants, sponsorship and philanthropic support', 3, 6],
    ['ART-006', 'Arts Administration', 'running the operations, contracts and compliance of an arts organisation', 2, 5],
  ]),
  ...mk('BPM', 'Engineering and Technical', [
    ['BPM-001', 'Upstream Bioprocessing', 'operating cell culture and fermentation to defined process parameters', 1, 5],
    ['BPM-002', 'Downstream Purification', 'operating chromatography, filtration and formulation steps', 1, 5],
    ['BPM-003', 'Aseptic Processing', 'working in classified areas to maintain sterility assurance', 1, 5],
    ['BPM-004', 'Process Validation', 'designing and executing validation across process, cleaning and equipment', 3, 6],
    ['BPM-005', 'Analytical Method Development', 'developing and validating analytical methods for release and stability', 2, 6],
  ]),
  ...mk('BPM', 'Governance and Assurance', [
    ['BPM-006', 'Good Manufacturing Practice', 'operating and enforcing GMP across production and documentation', 1, 6],
    ['BPM-007', 'Quality Management Systems', 'running deviation, CAPA and change control processes', 2, 6],
    ['BPM-008', 'Regulatory Affairs', 'preparing submissions and maintaining product registrations', 3, 6],
  ]),
  ...mk('BEV', 'Engineering and Technical', [
    ['BEV-001', 'Structural Engineering Design', 'designing structures to code for strength, serviceability and buildability', 3, 6],
    ['BEV-002', 'Building Services Engineering', 'designing and commissioning mechanical, electrical and plumbing systems', 2, 6],
    ['BEV-003', 'Integrated Digital Delivery', 'running BIM-based coordination across design, build and handover', 2, 6],
    ['BEV-004', 'Design for Manufacturing and Assembly', 'designing for prefabrication and modular construction', 3, 6],
    ['BEV-005', 'Geotechnical Works', 'assessing ground conditions and designing foundations and excavation support', 3, 6],
  ]),
  ...mk('BEV', 'Operations and Delivery', [
    ['BEV-006', 'Site Supervision', 'supervising site works for quality, sequence and safety', 1, 5],
    ['BEV-007', 'Construction Planning and Scheduling', 'building and controlling the construction programme', 2, 6],
    ['BEV-008', 'Quantity Surveying', 'measuring, valuing and controlling construction cost and claims', 2, 6],
    ['BEV-009', 'Facilities Management', 'operating and maintaining buildings across their life cycle', 1, 6],
  ]),
  ...mk('BEV', 'Sustainability and Compliance', [
    ['BEV-010', 'Green Mark Certification', 'delivering buildings to Green Mark and low-energy standards', 3, 6],
    ['BEV-011', 'Building Regulatory Submission', 'preparing and clearing regulatory submissions and approvals', 2, 5],
  ]),
  ...mk('CST', 'Sustainability and Compliance', [
    ['CST-001', 'Carbon Measurement and Reporting', 'quantifying emissions and preparing disclosure-grade carbon reports', 2, 6],
    ['CST-002', 'Carbon Project Development', 'developing carbon projects from concept through validation', 3, 6],
    ['CST-003', 'Monitoring, Reporting and Verification', 'designing and running MRV systems for carbon projects', 3, 6],
    ['CST-004', 'Carbon Standards and Methodologies', 'selecting and applying methodologies under recognised carbon standards', 3, 6],
    ['CST-005', 'Climate Risk Assessment', 'assessing physical and transition climate risk for assets and portfolios', 3, 6],
  ]),
  ...mk('CST', 'Commercial and Customer', [
    ['CST-006', 'Carbon Market Trading', 'trading carbon credits and managing market and counterparty exposure', 3, 6],
    ['CST-007', 'Sustainability Advisory', 'advising clients on decarbonisation strategy and transition planning', 3, 6],
    ['CST-008', 'Nature-Based Solutions', 'designing and appraising nature-based carbon and biodiversity projects', 3, 6],
  ]),
  ...mk('DSG', 'Design and Content', [
    ['DSG-001', 'User Research', 'planning and running research that produces usable design insight', 2, 6],
    ['DSG-002', 'Interaction Design', 'designing interfaces and flows that people can use without help', 2, 6],
    ['DSG-003', 'Service Design', 'designing services across channels, front stage and back stage', 3, 6],
    ['DSG-004', 'Industrial Design', 'designing physical products for use, manufacture and cost', 2, 6],
    ['DSG-005', 'Design Systems', 'building and governing reusable design systems and components', 3, 6],
    ['DSG-006', 'Brand and Communication Design', 'designing brand identity and communication across media', 2, 6],
  ]),
  ...mk('ECD', 'Care and Clinical', [
    ['ECD-001', 'Early Childhood Curriculum', 'planning and delivering curriculum aligned to the national framework', 1, 6],
    ['ECD-002', 'Child Development Observation', 'observing, documenting and interpreting children’s development', 1, 5],
    ['ECD-003', 'Early Intervention Support', 'identifying developmental needs and working with intervention partners', 2, 6],
    ['ECD-004', 'Learning Environment Design', 'setting up environments and materials that drive purposeful play', 1, 5],
  ]),
  ...mk('ECD', 'People and Organisation', [
    ['ECD-005', 'Family and Community Partnership', 'building working partnerships with families and community services', 2, 6],
    ['ECD-006', 'Centre Leadership', 'leading a preschool centre across people, quality, licensing and enrolment', 4, 6],
    ['ECD-007', 'Child Safeguarding', 'preventing, detecting and responding to child protection concerns', 2, 6],
  ]),
  ...mk('ELE', 'Engineering and Technical', [
    ['ELE-001', 'Semiconductor Process Engineering', 'owning a wafer fabrication process step for yield and stability', 3, 6],
    ['ELE-002', 'Equipment Engineering', 'maintaining and improving fabrication equipment uptime and performance', 2, 6],
    ['ELE-003', 'Test and Product Engineering', 'developing test programs and resolving product test failures', 2, 6],
    ['ELE-004', 'Advanced Packaging', 'developing and running advanced packaging and interconnect processes', 3, 6],
    ['ELE-005', 'Failure Analysis', 'isolating and explaining device failure using physical and electrical analysis', 3, 6],
    ['ELE-006', 'PCB Assembly and SMT', 'operating and optimising surface mount assembly lines', 1, 5],
  ]),
  ...mk('ELE', 'Data and Analytics', [
    ['ELE-007', 'Yield Analytics', 'analysing production data to find and remove yield loss', 3, 6],
    ['ELE-008', 'Statistical Process Control', 'operating SPC to keep processes inside control limits', 2, 5],
  ]),
  ...mk('ENC', 'Engineering and Technical', [
    ['ENC-001', 'Process Operations', 'operating refining and chemical process units within safe limits', 1, 5],
    ['ENC-002', 'Process Engineering', 'designing, debottlenecking and optimising chemical processes', 3, 6],
    ['ENC-003', 'Process Safety Management', 'applying process safety across design, operation and change', 3, 6],
    ['ENC-004', 'Asset Integrity and Reliability', 'keeping fixed and rotating equipment fit for service', 2, 6],
    ['ENC-005', 'Sustainable Feedstock Transition', 'converting processes to bio, circular and low-carbon feedstocks', 3, 6],
  ]),
  ...mk('ENC', 'Governance and Assurance', [
    ['ENC-006', 'Major Hazard Compliance', 'meeting major hazard installation obligations and demonstrating safety case', 3, 6],
    ['ENC-007', 'Environmental Emissions Control', 'controlling and reporting air, water and waste emissions', 2, 6],
  ]),
  ...mk('ENP', 'Engineering and Technical', [
    ['ENP-001', 'Power Generation Operations', 'operating generation plant to dispatch, efficiency and emissions targets', 2, 6],
    ['ENP-002', 'Grid Operations', 'operating and balancing the transmission and distribution network', 3, 6],
    ['ENP-003', 'Solar Photovoltaic Systems', 'designing, installing and maintaining PV systems and inverters', 1, 5],
    ['ENP-004', 'Energy Storage Systems', 'specifying and operating battery and thermal storage assets', 3, 6],
    ['ENP-005', 'Electrical Safety and Licensing', 'working to electrical safety regulations and licensing requirements', 1, 5],
  ]),
  ...mk('ENP', 'Commercial and Customer', [
    ['ENP-006', 'Energy Trading and Settlement', 'trading and settling in the wholesale electricity market', 3, 6],
    ['ENP-007', 'Energy Efficiency Auditing', 'auditing energy use and quantifying savings opportunities', 2, 6],
  ]),
  ...mk('ENG', 'Engineering and Technical', [
    ['ENG-001', 'Systems Engineering', 'managing requirements, interfaces and verification across a system', 3, 6],
    ['ENG-002', 'Control and Instrumentation', 'designing and commissioning control, instrumentation and SCADA systems', 2, 6],
    ['ENG-003', 'Mechanical Design', 'designing mechanical assemblies for function, cost and manufacture', 2, 6],
    ['ENG-004', 'Reliability Engineering', 'improving asset reliability through failure analysis and maintenance strategy', 3, 6],
    ['ENG-005', 'Digital Twin and Simulation', 'building simulation and digital twin models to predict asset behaviour', 3, 6],
    ['ENG-006', 'Robotics and Automation Integration', 'integrating robotics and automation into production and service', 2, 6],
  ]),
  ...mk('ENV', 'Operations and Delivery', [
    ['ENV-001', 'Cleaning Operations Management', 'planning and supervising cleaning operations to outcome standards', 1, 5],
    ['ENV-002', 'Waste Management Operations', 'collecting, sorting and routing waste streams for recovery or disposal', 1, 5],
    ['ENV-003', 'Pest Management', 'inspecting, treating and preventing pest infestation', 1, 5],
    ['ENV-004', 'Environmental Technology Deployment', 'deploying robotics, sensors and route optimisation in environmental services', 2, 5],
  ]),
  ...mk('ENV', 'Sustainability and Compliance', [
    ['ENV-005', 'Resource Recovery and Recycling', 'recovering material value from waste streams to specification', 2, 6],
    ['ENV-006', 'Environmental Public Health Compliance', 'meeting environmental public health law and licensing obligations', 2, 6],
  ]),
];
