// Job roles, part 3 (Public Transport through Wholesale Trade).
const mk = (sector, rows) => rows.map(([code, title, track, band, ssoc, pay, demand, tscs, ccs]) =>
  ({ code, sector, title, track, band, ssoc, payP25: pay[0], payMedian: pay[1], payP75: pay[2], demand, tscs, ccs }));

export const rolesC = [
  ...mk('PTR', [
    ['PTR-R01','Train Captain','Operations','Associate','8311',[3000,3700,4600],58,['PTR-001:2','PTR-008:2'],['CCS-SLF','CCS-DEC','CCS-COM']],
    ['PTR-R02','Rail Operations Controller','Operations','Professional','3119',[4200,5300,6600],62,['PTR-001:4','PTR-008:3','X-SEC-003:3'],['CCS-DEC','CCS-ADP','CCS-COM']],
    ['PTR-R03','Rail Maintenance Technician','Maintenance','Associate','7412',[3000,3800,4700],64,['PTR-005:2','X-OPS-004:2'],['CCS-SLF','CCS-COL','CCS-PRB']],
    ['PTR-R04','Signalling Engineer','Engineering','Professional','2151',[5500,7000,8800],69,['PTR-006:4','ENG-002:4','PTR-008:3'],['CCS-PRB','CCS-DEC','CCS-TRD']],
    ['PTR-R05','Transport Service Planner','Planning','Professional','2164',[5000,6300,8000],60,['PTR-003:4','X-DAT-003:3','LOG-007:3'],['CCS-SEN','CCS-PRB','CCS-COM']],
    ['PTR-R06','Depot Manager','Operations','Manager','1324',[7000,8800,11000],55,['PTR-004:5','PTR-007:4','X-PPL-001:4'],['CCS-DEC','CCS-DEV','CCS-COL']],
  ]),
  ...mk('RET', [
    ['RET-R01','Retail Associate','Store','Support','5223',[2000,2500,3100],61,['RET-001:2','RET-002:1'],['CCS-CUS','CCS-COL','CCS-SLF']],
    ['RET-R02','Store Manager','Store','Manager','1420',[3800,4800,6000],57,['RET-006:4','RET-007:3','X-PPL-001:3'],['CCS-CUS','CCS-DEC','CCS-DEV']],
    ['RET-R03','Visual Merchandiser','Merchandising','Associate','2163',[3000,3800,4800],49,['RET-002:3','DSG-006:2'],['CCS-CRT','CCS-COL','CCS-COM']],
    ['RET-R04','Category Manager','Buying','Manager','1420',[6500,8200,10500],58,['RET-003:5','X-COM-003:4','RET-008:3'],['CCS-DEC','CCS-INF','CCS-SEN']],
    ['RET-R05','E-Commerce Manager','Digital','Manager','1420',[6000,7500,9500],71,['RET-004:5','RET-005:4','RET-008:4'],['CCS-DIG','CCS-SEN','CCS-CRT']],
    ['RET-R06','Retail Analytics Specialist','Analytics','Professional','2529',[5000,6300,8000],69,['RET-008:4','X-DAT-002:4','X-DAT-003:3'],['CCS-SEN','CCS-DIG','CCS-COM']],
  ]),
  ...mk('SEA', [
    ['SEA-R01','Port Operations Executive','Operations','Associate','3324',[3400,4200,5300],57,['SEA-002:3','SEA-004:2'],['CCS-DEC','CCS-COL','CCS-ADP']],
    ['SEA-R02','Marine Superintendent','Technical','Professional','3151',[7000,9000,11500],60,['SEA-001:4','SEA-007:4','MAO-006:3'],['CCS-DEC','CCS-PRB','CCS-GLB']],
    ['SEA-R03','Chartering Manager','Commercial','Manager','1324',[9000,12000,16000],56,['SEA-005:5','X-COM-003:5','WHT-006:4'],['CCS-DEC','CCS-INF','CCS-GLB']],
    ['SEA-R04','Bunkering Surveyor','Operations','Associate','3155',[3800,4700,5900],52,['SEA-003:3','SEA-007:3'],['CCS-SLF','CCS-COM','CCS-DEC']],
    ['SEA-R05','Maritime Sustainability Manager','Sustainability','Manager','2143',[8000,10000,13000],73,['SEA-008:4','SEA-007:5','X-SUS-002:4'],['CCS-TRD','CCS-INF','CCS-GLB']],
  ]),
  ...mk('SEC', [
    ['SEC-R01','Security Officer','Operations','Support','5414',[2200,2700,3300],63,['SEC-001:2','SEC-006:1'],['CCS-SLF','CCS-COM','CCS-ADP']],
    ['SEC-R02','Security Supervisor','Operations','Associate','5414',[2800,3500,4300],60,['SEC-001:3','SEC-002:3','X-PPL-001:2'],['CCS-DEC','CCS-COM','CCS-COL']],
    ['SEC-R03','Command Centre Operator','Technology','Associate','5414',[3000,3800,4700],66,['SEC-002:3','SEC-003:3','X-SEC-001:2'],['CCS-SEN','CCS-DIG','CCS-SLF']],
    ['SEC-R04','Security Systems Engineer','Technology','Professional','2151',[5000,6300,8000],71,['SEC-003:4','ENG-002:3','ICT-014:2'],['CCS-DIG','CCS-PRB','CCS-TRD']],
    ['SEC-R05','Security Manager','Leadership','Manager','1219',[6500,8200,10500],62,['SEC-005:5','SEC-004:4','X-GOV-001:4'],['CCS-DEC','CCS-INF','CCS-ADP']],
  ]),
  ...mk('SSV', [
    ['SSV-R01','Social Work Associate','Casework','Associate','3412',[3000,3700,4600],68,['SSV-001:2','SSV-004:2'],['CCS-COM','CCS-BIN','CCS-SLF']],
    ['SSV-R02','Social Worker','Casework','Professional','2635',[4000,5000,6300],74,['SSV-001:4','SSV-004:4','SSV-002:3'],['CCS-SEN','CCS-COM','CCS-BIN']],
    ['SSV-R03','Counsellor','Clinical','Professional','2635',[4200,5200,6500],70,['SSV-002:4','SSV-004:4'],['CCS-COM','CCS-BIN','CCS-SLF']],
    ['SSV-R04','Programme Manager (Social Service)','Programmes','Manager','1341',[6000,7500,9500],63,['SSV-005:5','SSV-006:4','X-OPS-002:4'],['CCS-DEC','CCS-INF','CCS-DEV']],
    ['SSV-R05','Community Engagement Lead','Community','Professional','2635',[4500,5600,7000],61,['SSV-003:4','SSV-006:4','X-COM-001:4'],['CCS-BIN','CCS-INF','CCS-COL']],
    ['SSV-R06','Fundraising Manager','Development','Manager','1222',[6000,7500,9500],57,['SSV-007:5','X-COM-001:4','X-COM-003:4'],['CCS-INF','CCS-COM','CCS-CRT']],
  ]),
  ...mk('TOU', [
    ['TOU-R01','Attraction Host','Operations','Support','5113',[2100,2600,3200],55,['TOU-001:2','X-OPS-004:1'],['CCS-CUS','CCS-COM','CCS-COL']],
    ['TOU-R02','Tour Guide','Guiding','Associate','5113',[2600,3300,4200],50,['TOU-005:3','TOU-006:2'],['CCS-COM','CCS-GLB','CCS-CUS']],
    ['TOU-R03','MICE Project Manager','Events','Manager','1431',[5500,6800,8500],64,['TOU-002:5','X-OPS-002:4','X-COM-001:4'],['CCS-DEC','CCS-COL','CCS-ADP']],
    ['TOU-R04','Travel Product Executive','Product','Associate','3339',[3200,4000,5000],52,['TOU-003:3','TOU-004:2'],['CCS-CRT','CCS-CUS','CCS-SEN']],
    ['TOU-R05','Destination Marketing Manager','Marketing','Manager','1222',[6500,8200,10500],58,['TOU-004:5','MED-007:3','X-COM-001:4'],['CCS-INF','CCS-GLB','CCS-CRT']],
  ]),
  ...mk('TAE', [
    ['TAE-R01','Adult Educator','Facilitation','Professional','2356',[4000,5000,6300],66,['TAE-002:4','TAE-003:3','TAE-004:2'],['CCS-COM','CCS-DEV','CCS-ADP']],
    ['TAE-R02','Curriculum Developer','Design','Professional','2351',[5000,6300,8000],68,['TAE-001:4','TAE-005:3','TAE-006:3'],['CCS-CRT','CCS-TRD','CCS-COM']],
    ['TAE-R03','Assessment Specialist','Assessment','Professional','2356',[4800,6000,7500],60,['TAE-003:4','TAE-006:3','X-GOV-003:3'],['CCS-SEN','CCS-DEC','CCS-COM']],
    ['TAE-R04','Learning Technologist','Technology','Professional','2356',[5000,6300,8000],72,['TAE-004:4','X-SWP-003:3','ICT-009:2'],['CCS-DIG','CCS-CRT','CCS-LAG']],
    ['TAE-R05','Head of Learning Design','Leadership','Manager','1345',[8500,10500,13500],58,['TAE-001:5','TAE-006:5','X-PPL-002:4'],['CCS-DEC','CCS-DEV','CCS-INF']],
  ]),
  ...mk('WHT', [
    ['WHT-R01','Trade Operations Executive','Operations','Associate','3324',[3200,4000,5000],54,['WHT-005:3','LOG-008:2'],['CCS-SLF','CCS-COM','CCS-COL']],
    ['WHT-R02','Commodity Trader','Trading','Professional','3311',[8000,11000,16000],59,['WHT-001:4','WHT-006:4','X-GOV-001:4'],['CCS-DEC','CCS-SEN','CCS-ADP']],
    ['WHT-R03','Business Development Manager','Commercial','Manager','1221',[6500,8200,10500],62,['WHT-004:5','WHT-003:4','X-COM-003:4'],['CCS-INF','CCS-GLB','CCS-CUS']],
    ['WHT-R04','Trade Structuring Specialist','Structuring','Professional','2413',[7500,9500,12500],57,['WHT-002:4','FIN-008:3','X-GOV-001:4'],['CCS-TRD','CCS-DEC','CCS-INF']],
  ]),
];
