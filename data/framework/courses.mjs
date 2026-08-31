// Course catalogue: SYNTHETIC demonstration data.
// Course titles, codes, fees and outcome figures are generated for this reference
// platform and are NOT drawn from the official SkillsFuture course registry.
// Provider names are real Continuing Education and Training institutions, used to
// show how the registry links courses to providers; the courses themselves are not theirs.
// [code, title, provider, mode, hours, qualLevel, fullFee, outcomeRating, skills]
const mk = (rows) => rows.map(([code, title, provider, mode, hours, qual, fee, outcome, skills]) =>
  ({ code, title, provider, mode, hours, qual, fee, outcome, skills, provenance: 'synthetic' }));

export const providers = [
  'Nanyang Polytechnic', 'Singapore Polytechnic', 'Temasek Polytechnic', 'Ngee Ann Polytechnic',
  'Republic Polytechnic', 'Institute of Technical Education', 'Institute for Adult Learning',
  'NTUC LearningHub', 'NUS Institute of Systems Science', 'SMU Academy', 'NTU PaCE',
  'Singapore Institute of Management', 'Lithan Academy', 'Singapore Maritime Academy',
];

export const courses = mk([
  // --- Infocomm Technology -------------------------------------------------
  ['CRS-ICT-001','Professional Certificate in Full Stack Software Engineering','Nanyang Polytechnic','Blended',240,'Advanced Certificate',7800,82,['ICT-001:3','ICT-005:3','ICT-006:2']],
  ['CRS-ICT-002','Specialist Diploma in Cloud Architecture and DevSecOps','Singapore Polytechnic','Blended',320,'Specialist Diploma',9600,79,['ICT-003:4','ICT-004:4','ICT-002:3']],
  ['CRS-ICT-003','Certificate in Data Engineering with Modern Pipelines','NUS Institute of Systems Science','Blended',160,'Certificate',5400,84,['ICT-007:3','X-DAT-004:3','ICT-003:2']],
  ['CRS-ICT-004','Applied Machine Learning Engineering','NTU PaCE','Classroom',200,'Advanced Certificate',8200,81,['ICT-008:4','ICT-007:3','ICT-010:3']],
  ['CRS-ICT-005','Building Applications on Foundation Models','SMU Academy','Blended',120,'Certificate',4800,88,['ICT-009:4','X-SWP-003:3','ICT-005:2']],
  ['CRS-ICT-006','Security Operations Centre Analyst Programme','NTUC LearningHub','Classroom',180,'Advanced Certificate',6200,77,['ICT-011:3','X-SEC-001:3','ICT-014:2']],
  ['CRS-ICT-007','Offensive Security and Penetration Testing','Singapore Polytechnic','Classroom',160,'Advanced Certificate',7400,74,['ICT-013:4','ICT-012:3']],
  ['CRS-ICT-008','Digital Product Management Practice','SMU Academy','Blended',96,'Certificate',4200,76,['ICT-015:4','X-DAT-002:3','X-COM-001:3']],
  ['CRS-ICT-009','IT Service Desk and Endpoint Support','Institute of Technical Education','Classroom',120,'Certificate',2400,69,['ICT-016:3','X-SWP-001:3','X-SEC-001:2']],
  ['CRS-ICT-010','Test Automation Engineering','Republic Polytechnic','Online',100,'Certificate',3600,72,['ICT-006:4','ICT-004:2']],
  ['CRS-ICT-011','Enterprise Architecture for Practitioners','NUS Institute of Systems Science','Classroom',120,'Graduate Certificate',8800,70,['ICT-017:4','ICT-003:4']],
  ['CRS-ICT-012','Identity and Access Management Implementation','Nanyang Polytechnic','Blended',80,'Certificate',3200,73,['ICT-014:3','ICT-012:2']],

  // --- Cross-sector digital, data and AI -----------------------------------
  ['CRS-XDG-001','Data Literacy for the Workplace','NTUC LearningHub','Online',24,'Statement of Attainment',480,68,['X-DAT-001:2','CCS-DIG:1']],
  ['CRS-XDG-002','Business Intelligence and Dashboard Design','Temasek Polytechnic','Blended',60,'Certificate',1900,74,['X-DAT-002:3','X-DAT-001:3']],
  ['CRS-XDG-003','Applied Statistics for Business Decisions','Ngee Ann Polytechnic','Blended',80,'Certificate',2600,71,['X-DAT-003:3','X-DAT-001:3']],
  ['CRS-XDG-004','Data Governance and Quality Management','Singapore Institute of Management','Classroom',48,'Certificate',2200,66,['X-DAT-004:3','X-SEC-002:3']],
  ['CRS-XDG-005','Process Automation with Low-Code Platforms','Lithan Academy','Online',60,'Certificate',1800,75,['X-SWP-002:3','X-OPS-001:2']],
  ['CRS-XDG-006','Generative AI at Work: Practice and Guardrails','Institute for Adult Learning','Blended',32,'Statement of Attainment',900,86,['X-SWP-003:2','CCS-DIG:2']],
  ['CRS-XDG-007','Cyber Hygiene Essentials','NTUC LearningHub','Online',16,'Statement of Attainment',320,64,['X-SEC-001:2']],
  ['CRS-XDG-008','Personal Data Protection Practitioner','Singapore Institute of Management','Classroom',40,'Certificate',1600,70,['X-SEC-002:3','X-GOV-002:2']],
  ['CRS-XDG-009','Business Continuity Management Planning','Singapore Polytechnic','Blended',48,'Certificate',2400,65,['X-SEC-003:3','X-GOV-001:3']],

  // --- Cross-sector management and delivery --------------------------------
  ['CRS-XMG-001','Project Management Professional Practice','Nanyang Polytechnic','Blended',96,'Advanced Certificate',3800,73,['X-OPS-002:4','X-COM-002:3']],
  ['CRS-XMG-002','Lean Process Improvement Green Belt','Singapore Polytechnic','Classroom',80,'Certificate',3200,71,['X-OPS-001:3','PRE-007:3']],
  ['CRS-XMG-003','Vendor and Contract Management','SMU Academy','Classroom',40,'Certificate',2400,64,['X-OPS-003:3','X-COM-003:3']],
  ['CRS-XMG-004','Workplace Safety and Health Coordinator','NTUC LearningHub','Classroom',120,'Advanced Certificate',2800,76,['X-OPS-004:3']],
  ['CRS-XMG-005','Enterprise Risk Management','Singapore Institute of Management','Blended',56,'Certificate',3400,67,['X-GOV-001:4','X-GOV-003:3']],
  ['CRS-XMG-006','Negotiation and Commercial Influence','SMU Academy','Classroom',32,'Certificate',2800,69,['X-COM-003:4','CCS-INF:2']],
  ['CRS-XMG-007','Leading Change in Operating Teams','Institute for Adult Learning','Blended',48,'Certificate',2600,72,['X-PPL-003:4','CCS-ADP:2']],
  ['CRS-XMG-008','Strategic Workforce Planning','Institute for Adult Learning','Blended',56,'Advanced Certificate',3600,70,['X-PPL-002:4','HRE-007:3']],

  // --- Critical Core Skills programmes --------------------------------------
  ['CRS-CCS-001','Creative Thinking and Ideation Practice','Institute for Adult Learning','Classroom',24,'Statement of Attainment',780,66,['CCS-CRT:2']],
  ['CRS-CCS-002','Decision Making Under Uncertainty','SMU Academy','Classroom',24,'Statement of Attainment',1200,68,['CCS-DEC:2']],
  ['CRS-CCS-003','Structured Problem Solving','NTUC LearningHub','Blended',32,'Statement of Attainment',720,70,['CCS-PRB:2']],
  ['CRS-CCS-004','Sense Making with Data and Narrative','Institute for Adult Learning','Blended',24,'Statement of Attainment',820,71,['CCS-SEN:2','X-DAT-001:2']],
  ['CRS-CCS-005','Transdisciplinary Collaboration','Singapore Institute of Management','Classroom',24,'Statement of Attainment',980,63,['CCS-TRD:2','CCS-COL:2']],
  ['CRS-CCS-006','Building Inclusive Teams','NTUC LearningHub','Blended',16,'Statement of Attainment',560,65,['CCS-BIN:2']],
  ['CRS-CCS-007','Collaboration Across Boundaries','Institute for Adult Learning','Classroom',16,'Statement of Attainment',620,64,['CCS-COL:2']],
  ['CRS-CCS-008','Professional Communication and Influence','SMU Academy','Classroom',32,'Statement of Attainment',1400,72,['CCS-COM:2','CCS-INF:2']],
  ['CRS-CCS-009','Customer Orientation in Service Delivery','NTUC LearningHub','Blended',24,'Statement of Attainment',680,67,['CCS-CUS:2']],
  ['CRS-CCS-010','Coaching and Developing People','Institute for Adult Learning','Classroom',32,'Certificate',1500,73,['CCS-DEV:2','X-PPL-001:3']],
  ['CRS-CCS-011','Adaptability and Resilience at Work','Singapore Institute of Management','Online',16,'Statement of Attainment',420,69,['CCS-ADP:2','CCS-SLF:2']],
  ['CRS-CCS-012','Digital Fluency for Non-Technical Roles','NTUC LearningHub','Online',24,'Statement of Attainment',520,74,['CCS-DIG:2','X-SWP-001:2']],
  ['CRS-CCS-013','Global Perspective for Regional Roles','SMU Academy','Blended',24,'Statement of Attainment',1100,62,['CCS-GLB:2']],
  ['CRS-CCS-014','Learning Agility and Self-Directed Learning','Institute for Adult Learning','Online',16,'Statement of Attainment',380,71,['CCS-LAG:2']],
  ['CRS-CCS-015','Self Management and Personal Effectiveness','NTUC LearningHub','Online',16,'Statement of Attainment',360,66,['CCS-SLF:2']],
  ['CRS-CCS-016','Advanced Influence and Stakeholder Leadership','SMU Academy','Classroom',40,'Certificate',2600,70,['CCS-INF:3','X-COM-001:4']],

  // --- Healthcare and care ---------------------------------------------------
  ['CRS-HLT-001','Advanced Diploma in Nursing Practice','Nanyang Polytechnic','Classroom',480,'Advanced Diploma',6800,86,['HLT-001:4','HLT-002:4','HLT-005:3']],
  ['CRS-HLT-002','Medication Safety and Administration','Singapore Institute of Management','Blended',48,'Certificate',1400,79,['HLT-003:3','HLT-005:2']],
  ['CRS-HLT-003','Community and Home Care Practice','Ngee Ann Polytechnic','Blended',96,'Certificate',2200,81,['HLT-006:3','HLT-010:3']],
  ['CRS-HLT-004','Health Informatics and Clinical Data','NUS Institute of Systems Science','Blended',80,'Advanced Certificate',4600,78,['HLT-007:4','X-DAT-002:3']],
  ['CRS-HLT-005','Clinical Quality Improvement Methods','Temasek Polytechnic','Blended',56,'Certificate',2400,75,['HLT-008:3','X-OPS-001:3']],
  ['CRS-HLT-006','Infection Prevention and Control Practice','Nanyang Polytechnic','Classroom',40,'Certificate',1200,80,['HLT-005:3']],

  // --- Early childhood and education ----------------------------------------
  ['CRS-ECD-001','Diploma in Early Childhood Care and Education','Ngee Ann Polytechnic','Classroom',720,'Diploma',6400,88,['ECD-001:3','ECD-002:3','ECD-004:3']],
  ['CRS-ECD-002','Early Intervention for Diverse Learners','Temasek Polytechnic','Blended',96,'Advanced Certificate',3200,82,['ECD-003:3','ECD-002:3']],
  ['CRS-ECD-003','Preschool Centre Leadership','Institute for Adult Learning','Blended',120,'Advanced Certificate',4200,77,['ECD-006:4','X-PPL-001:4']],
  ['CRS-ECD-004','Child Safeguarding and Protection','Singapore Institute of Management','Online',24,'Statement of Attainment',680,79,['ECD-007:3']],
  ['CRS-TAE-001','Advanced Certificate in Learning and Performance','Institute for Adult Learning','Blended',160,'Advanced Certificate',3800,80,['TAE-002:4','TAE-003:3']],
  ['CRS-TAE-002','Diploma in Design and Development of Learning','Institute for Adult Learning','Blended',280,'Diploma',6200,78,['TAE-001:4','TAE-005:4','TAE-006:3']],
  ['CRS-TAE-003','Learning Technology and Simulation Design','Republic Polytechnic','Blended',96,'Certificate',3400,76,['TAE-004:4','X-SWP-003:2']],

  // --- Built environment, engineering and manufacturing ---------------------
  ['CRS-BEV-001','Specialist Diploma in Integrated Digital Delivery','Singapore Polytechnic','Blended',320,'Specialist Diploma',7600,79,['BEV-003:4','BEV-004:3']],
  ['CRS-BEV-002','Green Mark Professional Preparation','Building and Construction Authority Academy','Classroom',120,'Advanced Certificate',4200,77,['BEV-010:4','X-SUS-001:3']],
  ['CRS-BEV-003','Construction Planning and Scheduling','Nanyang Polytechnic','Blended',80,'Certificate',2800,72,['BEV-007:3','X-OPS-002:3']],
  ['CRS-BEV-004','Quantity Surveying Practice','Singapore Polytechnic','Blended',120,'Advanced Certificate',3600,71,['BEV-008:3','X-COM-002:3']],
  ['CRS-BEV-005','Facilities Management Operations','Temasek Polytechnic','Blended',96,'Certificate',2900,70,['BEV-009:3','X-OPS-003:3']],
  ['CRS-PRE-001','CNC Machining and CAM Programming','Institute of Technical Education','Classroom',200,'Certificate',2600,74,['PRE-001:3','PRE-006:3']],
  ['CRS-PRE-002','Industrial Automation and Robotics Integration','Singapore Polytechnic','Blended',180,'Advanced Certificate',5400,80,['PRE-005:4','ENG-006:3']],
  ['CRS-PRE-003','Additive Manufacturing for Production','Nanyang Polytechnic','Blended',120,'Advanced Certificate',4800,73,['PRE-004:3','PRE-006:3']],
  ['CRS-PRE-004','Metrology and Dimensional Inspection','Institute of Technical Education','Classroom',80,'Certificate',1800,69,['PRE-003:3']],
  ['CRS-ENG-001','Systems Engineering Fundamentals','NTU PaCE','Classroom',96,'Advanced Certificate',5200,72,['ENG-001:3','X-OPS-002:3']],
  ['CRS-ENG-002','Reliability Centred Maintenance','Singapore Polytechnic','Blended',80,'Certificate',3400,71,['ENG-004:4','ENC-004:3']],
  ['CRS-ENG-003','Digital Twin and Simulation Practice','NTU PaCE','Blended',96,'Advanced Certificate',5600,75,['ENG-005:4','ICT-007:2']],
  ['CRS-ELE-001','Semiconductor Process Technology','Nanyang Polytechnic','Blended',200,'Advanced Certificate',6200,84,['ELE-001:3','ELE-008:3']],
  ['CRS-ELE-002','Equipment Engineering and Maintenance','Singapore Polytechnic','Classroom',180,'Advanced Certificate',5400,83,['ELE-002:3','ENG-004:2']],
  ['CRS-ELE-003','Advanced Packaging and Interconnect','Nanyang Polytechnic','Blended',160,'Specialist Diploma',6800,80,['ELE-004:4','ELE-001:3']],
  ['CRS-ELE-004','Yield Analytics for Manufacturing','Republic Polytechnic','Blended',96,'Certificate',3800,79,['ELE-007:3','X-DAT-003:3']],
  ['CRS-BPM-001','GMP and Aseptic Manufacturing Practice','Republic Polytechnic','Blended',160,'Advanced Certificate',5200,82,['BPM-006:3','BPM-003:3']],
  ['CRS-BPM-002','Process Validation for Biologics','Singapore Polytechnic','Blended',120,'Advanced Certificate',5600,78,['BPM-004:4','BPM-007:3']],
  ['CRS-BPM-003','Analytical Method Development and Validation','Temasek Polytechnic','Classroom',120,'Advanced Certificate',4800,76,['BPM-005:3','X-DAT-003:3']],
  ['CRS-ENC-001','Process Safety Management','Singapore Polytechnic','Classroom',96,'Advanced Certificate',4600,74,['ENC-003:4','ENC-006:3']],
  ['CRS-ENC-002','Sustainable Feedstock and Circular Chemistry','NTU PaCE','Blended',80,'Certificate',4200,76,['ENC-005:3','X-SUS-003:3']],
  ['CRS-ENP-001','Solar PV System Design and Installation','Institute of Technical Education','Classroom',120,'Certificate',2400,81,['ENP-003:3','ENP-005:2']],
  ['CRS-ENP-002','Energy Storage and Grid Integration','NTU PaCE','Blended',96,'Advanced Certificate',5400,79,['ENP-004:4','ENP-002:3']],
  ['CRS-ENP-003','Certified Energy Manager Preparation','Singapore Polytechnic','Blended',120,'Advanced Certificate',4600,75,['ENP-007:4','X-SUS-002:3']],

  // --- Sustainability and carbon ---------------------------------------------
  ['CRS-SUS-001','Greenhouse Gas Accounting and Reporting','NUS Institute of Systems Science','Blended',80,'Advanced Certificate',4800,83,['X-SUS-002:4','CST-001:3']],
  ['CRS-SUS-002','Carbon Project Development and MRV','SMU Academy','Blended',120,'Specialist Diploma',7200,80,['CST-002:4','CST-003:4','CST-004:3']],
  ['CRS-SUS-003','Climate Risk and Transition Planning','SMU Academy','Blended',64,'Advanced Certificate',5200,78,['CST-005:4','X-SUS-001:4']],
  ['CRS-SUS-004','Carbon Markets and Trading Practice','SMU Academy','Classroom',56,'Advanced Certificate',5600,74,['CST-006:3','X-GOV-001:3']],
  ['CRS-SUS-005','Sustainability Reporting for Enterprises','Singapore Institute of Management','Blended',48,'Certificate',2800,72,['X-SUS-001:3','X-SUS-002:3']],
  ['CRS-SUS-006','Circular Economy and Resource Recovery','Republic Polytechnic','Blended',56,'Certificate',2400,70,['X-SUS-003:3','ENV-005:3']],

  // --- Financial services ----------------------------------------------------
  ['CRS-FIN-001','Credit Risk Analysis Practice','SMU Academy','Blended',96,'Advanced Certificate',5400,77,['FIN-001:3','X-DAT-003:3']],
  ['CRS-FIN-002','Anti-Money Laundering and Financial Crime','Singapore Institute of Management','Blended',64,'Advanced Certificate',3800,80,['FIN-004:4','FIN-012:3']],
  ['CRS-FIN-003','Quantitative Methods for Risk','NTU PaCE','Classroom',120,'Graduate Certificate',9200,75,['FIN-011:4','FIN-002:3']],
  ['CRS-FIN-004','Digital Banking Product Design','SMU Academy','Blended',80,'Advanced Certificate',5800,78,['FIN-013:4','ICT-015:3']],
  ['CRS-FIN-005','Insurance Underwriting Fundamentals','Singapore Institute of Management','Blended',80,'Certificate',3200,71,['FIN-009:3','FIN-001:2']],
  ['CRS-FIN-006','Wealth Advisory and Client Portfolio Practice','SMU Academy','Classroom',96,'Advanced Certificate',6200,73,['FIN-007:4','FIN-006:3']],

  // --- Human resource ---------------------------------------------------------
  ['CRS-HRE-001','Skills-Based Job Redesign Practitioner','Institute for Adult Learning','Blended',80,'Advanced Certificate',3800,84,['HRE-006:4','HRE-008:3']],
  ['CRS-HRE-002','People Analytics Practice','SMU Academy','Blended',72,'Advanced Certificate',4600,79,['HRE-007:4','X-DAT-003:3']],
  ['CRS-HRE-003','Total Rewards Design','Singapore Institute of Management','Classroom',64,'Advanced Certificate',4200,72,['HRE-002:4','X-COM-002:3']],
  ['CRS-HRE-004','Employment Law and Employee Relations','SMU Academy','Classroom',48,'Certificate',3200,74,['HRE-009:4','HRE-003:3']],
  ['CRS-HRE-005','Talent Acquisition and Skills-First Hiring','NTUC LearningHub','Blended',56,'Certificate',2400,81,['HRE-001:4','HRE-006:3']],

  // --- Logistics, transport and maritime -------------------------------------
  ['CRS-LOG-001','Warehouse Operations and Automation','Institute of Technical Education','Blended',120,'Certificate',2200,76,['LOG-001:3','LOG-006:2']],
  ['CRS-LOG-002','Supply Chain Planning and Analytics','Ngee Ann Polytechnic','Blended',120,'Advanced Certificate',4400,80,['LOG-003:4','LOG-007:3']],
  ['CRS-LOG-003','Freight Forwarding and Customs Practice','Singapore Maritime Academy','Classroom',96,'Certificate',2600,72,['LOG-002:3','LOG-008:3']],
  ['CRS-LOG-004','Cold Chain Management','Republic Polytechnic','Blended',56,'Certificate',2200,70,['LOG-005:3','AGF-007:2']],
  ['CRS-SEA-001','Ship Management and Technical Superintendency','Singapore Maritime Academy','Blended',160,'Advanced Certificate',6400,78,['SEA-001:4','SEA-007:3']],
  ['CRS-SEA-002','Alternative Marine Fuels and Decarbonisation','Singapore Maritime Academy','Blended',80,'Advanced Certificate',5200,81,['SEA-008:3','SEA-007:4']],
  ['CRS-SEA-003','Port Terminal Operations Management','Singapore Maritime Academy','Classroom',120,'Advanced Certificate',4200,75,['SEA-002:4','LOG-007:2']],
  ['CRS-AIR-001','Airport Operations and Airside Safety','Temasek Polytechnic','Blended',120,'Certificate',3200,77,['AIR-001:3','AIR-006:3']],
  ['CRS-AIR-002','Air Cargo Handling and Documentation','Republic Polytechnic','Classroom',96,'Certificate',2600,73,['AIR-003:3','LOG-008:2']],
  ['CRS-AER-001','Aircraft Maintenance Licensing Preparation','Singapore Polytechnic','Classroom',400,'Advanced Diploma',9800,85,['AER-001:4','AER-006:3']],
  ['CRS-AER-002','Non-Destructive Testing Level II','Nanyang Polytechnic','Classroom',160,'Advanced Certificate',5200,79,['AER-004:3']],
  ['CRS-PTR-001','Rail Systems Maintenance','Institute of Technical Education','Classroom',200,'Certificate',2800,80,['PTR-005:3','X-OPS-004:2']],
  ['CRS-PTR-002','Signalling and Train Control Systems','Singapore Polytechnic','Blended',160,'Advanced Certificate',5600,78,['PTR-006:4','ENG-002:3']],

  // --- Lifestyle, retail and services ----------------------------------------
  ['CRS-RET-001','Retail Store Management','NTUC LearningHub','Blended',96,'Certificate',2200,72,['RET-006:3','RET-007:3']],
  ['CRS-RET-002','E-Commerce and Omni-Channel Operations','Republic Polytechnic','Blended',80,'Certificate',2600,78,['RET-004:4','RET-005:3']],
  ['CRS-RET-003','Retail Analytics for Trading Decisions','Temasek Polytechnic','Online',60,'Certificate',2100,75,['RET-008:3','X-DAT-002:3']],
  ['CRS-FSV-001','Culinary Skills and Kitchen Operations','Institute of Technical Education','Classroom',240,'Certificate',3200,74,['FSV-001:3','FSV-002:3','FSV-005:2']],
  ['CRS-FSV-002','Food and Beverage Cost and Menu Engineering','Temasek Polytechnic','Blended',56,'Certificate',2200,73,['FSV-004:3','FSV-006:3']],
  ['CRS-FSV-003','Food Hygiene Management for Premises','NTUC LearningHub','Classroom',24,'Statement of Attainment',420,70,['FSV-005:3']],
  ['CRS-HAS-001','Hotel Revenue and Distribution Management','Temasek Polytechnic','Blended',80,'Advanced Certificate',3800,76,['HAS-002:4','HAS-005:3']],
  ['CRS-HAS-002','Guest Experience and Service Recovery','NTUC LearningHub','Blended',40,'Certificate',1400,72,['HAS-003:3','CCS-CUS:2']],
  ['CRS-TOU-001','MICE Event Project Management','Ngee Ann Polytechnic','Blended',96,'Advanced Certificate',3600,74,['TOU-002:4','X-OPS-002:3']],
  ['CRS-TOU-002','Sustainable Tourism Operations','Republic Polytechnic','Online',40,'Certificate',1600,71,['TOU-006:3','X-SUS-001:3']],
  ['CRS-TOU-003','Licensed Tour Guide Preparation','Singapore Institute of Management','Classroom',120,'Certificate',2200,68,['TOU-005:3','CCS-GLB:2']],

  // --- Professional services --------------------------------------------------
  ['CRS-ACC-001','Financial Reporting under SFRS','Singapore Institute of Management','Blended',96,'Advanced Certificate',4200,76,['ACC-001:3','ACC-006:3']],
  ['CRS-ACC-002','Finance Automation and Close Optimisation','SMU Academy','Blended',64,'Certificate',3400,79,['ACC-009:3','X-SWP-002:3']],
  ['CRS-ACC-003','Forensic Accounting and Fraud Investigation','SMU Academy','Classroom',80,'Advanced Certificate',5200,73,['ACC-010:4','FIN-012:3']],
  ['CRS-LEG-001','Legal Operations and Technology','SMU Academy','Blended',56,'Certificate',3600,75,['LEG-005:3','LEG-006:3']],
  ['CRS-IPR-001','Intellectual Property Strategy and Portfolio','SMU Academy','Blended',72,'Advanced Certificate',5400,74,['IPR-001:3','IPR-007:3']],
  ['CRS-IPR-002','Patent Drafting Practice','NTU PaCE','Classroom',96,'Advanced Certificate',6800,72,['IPR-002:4','IPR-004:3']],
  ['CRS-DSG-001','User Research and Interaction Design','Nanyang Polytechnic','Blended',120,'Advanced Certificate',4600,80,['DSG-001:3','DSG-002:3']],
  ['CRS-DSG-002','Service Design for Public and Private Services','SMU Academy','Blended',80,'Advanced Certificate',5200,77,['DSG-003:4','DSG-001:3']],
  ['CRS-DSG-003','Design Systems and Front-End Collaboration','Republic Polytechnic','Online',60,'Certificate',2600,74,['DSG-005:3','ICT-001:2']],
  ['CRS-MED-001','Digital Content Production','Ngee Ann Polytechnic','Blended',120,'Certificate',3200,71,['MED-001:3','MED-002:3']],
  ['CRS-MED-002','Immersive and Virtual Production','Nanyang Polytechnic','Blended',96,'Advanced Certificate',4800,73,['MED-004:3','MED-002:3']],
  ['CRS-MED-003','Audience Analytics and Content Monetisation','Republic Polytechnic','Online',48,'Certificate',2200,72,['MED-007:3','MED-006:3']],

  // --- Social service, security, environment, agrifood, landscape -------------
  ['CRS-SSV-001','Social Case Management Practice','Ngee Ann Polytechnic','Blended',160,'Advanced Certificate',3400,80,['SSV-001:4','SSV-004:3']],
  ['CRS-SSV-002','Counselling Skills and Ethics','Singapore Institute of Management','Classroom',120,'Advanced Certificate',4200,78,['SSV-002:3','CCS-COM:3']],
  ['CRS-SSV-003','Programme Design and Outcome Evaluation','Institute for Adult Learning','Blended',72,'Certificate',3000,74,['SSV-005:4','TAE-006:3']],
  ['CRS-SEC-001','Security Command Centre Operations','NTUC LearningHub','Classroom',96,'Certificate',2400,76,['SEC-002:3','SEC-003:3']],
  ['CRS-SEC-002','Security Risk Assessment and Planning','Temasek Polytechnic','Blended',72,'Advanced Certificate',3800,74,['SEC-005:4','X-GOV-001:3']],
  ['CRS-ENV-001','Environmental Services Technology and Robotics','Republic Polytechnic','Blended',80,'Certificate',2400,75,['ENV-004:3','ENG-006:2']],
  ['CRS-ENV-002','Waste and Resource Recovery Operations','Ngee Ann Polytechnic','Blended',96,'Certificate',2600,73,['ENV-002:3','ENV-005:3']],
  ['CRS-AGF-001','Controlled Environment Agriculture Operations','Republic Polytechnic','Blended',120,'Certificate',2800,77,['AGF-001:3','AGF-004:2']],
  ['CRS-AGF-002','Aquaculture Production and Health Management','Temasek Polytechnic','Blended',120,'Advanced Certificate',3400,75,['AGF-002:3','AGF-006:3']],
  ['CRS-AGF-003','HACCP and Food Safety Systems','NTUC LearningHub','Classroom',48,'Certificate',1600,78,['AGF-005:3','FMF-004:3']],
  ['CRS-LND-001','Arboriculture and Tree Management','National Parks Board Academy','Classroom',120,'Certificate',2400,74,['LND-003:3','LND-002:3']],
  ['CRS-LND-002','Landscape Design and Biodiversity','Ngee Ann Polytechnic','Blended',96,'Advanced Certificate',3600,71,['LND-001:3','LND-005:3']],
  ['CRS-FMF-001','Food Product Development and Scale-Up','Republic Polytechnic','Blended',120,'Advanced Certificate',3800,76,['FMF-007:3','FMF-008:3']],
  ['CRS-MAO-001','Marine Welding to Class Standards','Institute of Technical Education','Classroom',200,'Certificate',2800,73,['MAO-002:3','MAO-007:2']],
  ['CRS-MAO-002','Ship Repair Project Delivery','Singapore Maritime Academy','Blended',120,'Advanced Certificate',4800,74,['MAO-005:4','X-OPS-002:3']],
  ['CRS-ART-001','Arts Management and Programming','Singapore Institute of Management','Blended',96,'Certificate',3200,64,['ART-003:3','ART-006:3']],
  ['CRS-ART-002','Technical Production for Live Events','Institute of Technical Education','Classroom',120,'Certificate',2400,66,['ART-002:3']],
  ['CRS-WHT-001','Commodity Trading Fundamentals','SMU Academy','Blended',80,'Advanced Certificate',5800,75,['WHT-001:3','WHT-006:3']],
  ['CRS-WHT-002','Trade Documentation and Settlement','Singapore Maritime Academy','Classroom',64,'Certificate',2200,71,['WHT-005:3','FIN-008:2']],
]);

// Funding schemes administered by the labour authority.
export const fundingSchemes = [
  { code: 'BASE-SUB', name: 'SkillsFuture Course Fee Subsidy', kind: 'subsidy', rate: 0.70,
    eligibility: 'Singapore Citizens and Permanent Residents, for approved courses.',
    note: 'Baseline subsidy of up to 70% of course fee.' },
  { code: 'MCES', name: 'Mid-Career Enhanced Subsidy', kind: 'subsidy', rate: 0.90,
    eligibility: 'Singapore Citizens aged 40 and above.',
    note: 'Up to 90% of course fee for eligible courses.' },
  { code: 'SFC-OPEN', name: 'SkillsFuture Credit (Opening)', kind: 'credit', amount: 500,
    eligibility: 'Singapore Citizens aged 25 and above.',
    note: 'One-off opening credit of $500; does not expire.' },
  { code: 'SFC-MID', name: 'SkillsFuture Credit (Mid-Career)', kind: 'credit', amount: 4000,
    eligibility: 'Singapore Citizens aged 40 and above, from 1 May 2024.',
    note: '$4,000 top-up for selected courses with strong employability outcomes; does not expire.' },
  { code: 'SFTA-FT', name: 'SkillsFuture Mid-Career Training Allowance (Full-Time)', kind: 'allowance',
    eligibility: 'Singapore Citizens aged 40 and above on eligible full-time training.',
    note: '50% of average income over the preceding 12 months, minimum $300 and maximum $3,000 per month; 24-month lifetime cap across full-time and part-time.' },
  { code: 'SFTA-PT', name: 'SkillsFuture Mid-Career Training Allowance (Part-Time)', kind: 'allowance',
    eligibility: 'Singapore Citizens aged 40 and above with earned income in the last 12 months.',
    note: 'Flat $300 per month for selected part-time training; extended from 1 March 2026. Counts to the same 24-month lifetime cap.' },
];
