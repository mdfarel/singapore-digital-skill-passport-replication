// Critical Core Skills (CCS): the 16 transferable skills SkillsFuture identifies as
// employer-critical across every sector, grouped into three clusters.
// Each CCS is assessed at three proficiency bands: Basic, Intermediate, Advanced.

export const ccsClusters = [
  { code: 'TC', name: 'Thinking Critically',
    blurb: 'Cognitive skills that let you see connections, frame problems and choose well under change.' },
  { code: 'IO', name: 'Interacting with Others',
    blurb: 'Skills for working through other people: persuading, including, developing and serving.' },
  { code: 'SR', name: 'Staying Relevant',
    blurb: 'Managing yourself and reading the signals that decide what to learn next.' },
];

export const ccsBands = [
  { band: 1, name: 'Basic', short: 'Applies the skill in familiar, structured situations with guidance.' },
  { band: 2, name: 'Intermediate', short: 'Applies the skill independently across varied situations and coaches peers.' },
  { band: 3, name: 'Advanced', short: 'Sets direction, resolves ambiguity and builds the capability in others at scale.' },
];

export const ccs = [
  {
    code: 'CCS-CRT', cluster: 'TC', title: 'Creative Thinking',
    description: 'Adopt a fresh perspective to generate and combine ideas that lead to new value.',
    levels: [
      { band: 1, descriptor: 'Generate ideas within a defined brief and build on the suggestions of others.',
        behaviours: ['Contributes ideas in structured sessions', 'Adapts an existing approach to a new task', 'Recognises when the usual method is not working'] },
      { band: 2, descriptor: 'Facilitate idea generation across a team and turn promising ideas into testable concepts.',
        behaviours: ['Runs structured ideation with mixed groups', 'Prototypes and tests a concept before committing', 'Combines ideas from unrelated domains'] },
      { band: 3, descriptor: 'Build an environment where original thinking is expected, resourced and converted into value.',
        behaviours: ['Sets innovation direction and risk appetite', 'Sponsors experiments with unclear payoff', 'Removes structural barriers to new ideas'] },
    ],
  },
  {
    code: 'CCS-DEC', cluster: 'TC', title: 'Decision Making',
    description: 'Choose a course of action from available options using evidence, judgement and awareness of consequence.',
    levels: [
      { band: 1, descriptor: 'Make routine decisions within clear parameters and escalate what falls outside them.',
        behaviours: ['Applies decision rules consistently', 'Identifies who owns a decision', 'Documents the basis of a choice'] },
      { band: 2, descriptor: 'Weigh competing options under incomplete information and own the outcome.',
        behaviours: ['Frames options with explicit trade-offs', 'Tests assumptions before deciding', 'Sets review points to correct course'] },
      { band: 3, descriptor: 'Decide on high-stakes, irreversible matters and build decision quality into the organisation.',
        behaviours: ['Allocates decision rights deliberately', 'Manages second-order and reputational consequence', 'Institutes post-decision review'] },
    ],
  },
  {
    code: 'CCS-PRB', cluster: 'TC', title: 'Problem Solving',
    description: 'Define a problem accurately, find its causes and implement a solution that holds.',
    levels: [
      { band: 1, descriptor: 'Resolve familiar problems using established methods and known escalation paths.',
        behaviours: ['Describes a problem in factual terms', 'Applies a standard troubleshooting sequence', 'Checks that the fix actually worked'] },
      { band: 2, descriptor: 'Diagnose root causes of unfamiliar problems and design durable solutions.',
        behaviours: ['Separates symptom from cause', 'Uses data to test candidate causes', 'Designs against recurrence, not just recovery'] },
      { band: 3, descriptor: 'Resolve systemic and cross-boundary problems where the problem itself is contested.',
        behaviours: ['Reframes problems that resist solution', 'Aligns parties with conflicting definitions', 'Redesigns systems to remove whole problem classes'] },
    ],
  },
  {
    code: 'CCS-SEN', cluster: 'TC', title: 'Sense Making',
    description: 'Interpret and analyse information to recognise patterns, meaning and opportunity.',
    levels: [
      { band: 1, descriptor: 'Organise information from given sources and summarise what it shows.',
        behaviours: ['Distinguishes fact from inference', 'Spots obvious anomalies in data', 'Summarises findings without distortion'] },
      { band: 2, descriptor: 'Synthesise ambiguous and conflicting information into a defensible reading of the situation.',
        behaviours: ['Triangulates across sources of varying quality', 'Names the uncertainty in a conclusion', 'Draws implications, not just observations'] },
      { band: 3, descriptor: 'Read weak signals ahead of others and shape how the organisation interprets its environment.',
        behaviours: ['Detects pattern shifts before they are obvious', 'Challenges prevailing organisational narratives', 'Builds shared interpretive frameworks'] },
    ],
  },
  {
    code: 'CCS-TRD', cluster: 'TC', title: 'Transdisciplinary Thinking',
    description: 'Draw on concepts from multiple disciplines to make decisions and solve problems that no single field covers.',
    levels: [
      { band: 1, descriptor: 'Recognise where another discipline holds knowledge relevant to your work and seek it out.',
        behaviours: ['Identifies the limits of own expertise', 'Asks informed questions of other specialists', 'Uses cross-domain vocabulary accurately'] },
      { band: 2, descriptor: 'Integrate methods from adjacent disciplines into your own practice and translate between them.',
        behaviours: ['Borrows and adapts methods across fields', 'Translates specialist findings for other audiences', 'Runs mixed-discipline working groups'] },
      { band: 3, descriptor: 'Lead work at the intersection of disciplines and create the conditions for it to succeed.',
        behaviours: ['Frames problems that cut across professions', 'Builds teams around a problem, not a function', 'Resolves conflict between disciplinary standards'] },
    ],
  },
  {
    code: 'CCS-BIN', cluster: 'IO', title: 'Building Inclusivity',
    description: 'Manage relationships across diverse groups so that difference becomes an asset.',
    levels: [
      { band: 1, descriptor: 'Work respectfully with colleagues of different backgrounds and adjust your own behaviour.',
        behaviours: ['Uses inclusive language as a default', 'Notices who is not being heard', 'Asks rather than assumes'] },
      { band: 2, descriptor: 'Design ways of working that let a diverse team contribute fully.',
        behaviours: ['Adapts processes for different needs', 'Surfaces and addresses exclusion in the team', 'Mediates across cultural expectations'] },
      { band: 3, descriptor: 'Set inclusion policy and hold the organisation to it.',
        behaviours: ['Sets measurable inclusion outcomes', 'Removes structural bias in systems and criteria', 'Holds leaders accountable for inclusive practice'] },
    ],
  },
  {
    code: 'CCS-COL', cluster: 'IO', title: 'Collaboration',
    description: 'Work with others towards a shared outcome, contributing and receiving in equal measure.',
    levels: [
      { band: 1, descriptor: 'Contribute reliably to a team, meeting commitments and sharing information.',
        behaviours: ['Delivers what was agreed, on time', 'Shares information proactively', 'Asks for help before a problem grows'] },
      { band: 2, descriptor: 'Coordinate work across teams and resolve friction without escalation.',
        behaviours: ['Negotiates interfaces between teams', 'Surfaces and settles disagreement early', 'Builds trust with partners outside own unit'] },
      { band: 3, descriptor: 'Build partnerships across organisational boundaries and sustain them under strain.',
        behaviours: ['Structures multi-party agreements', 'Aligns partners with divergent incentives', 'Keeps alliances working through conflict'] },
    ],
  },
  {
    code: 'CCS-COM', cluster: 'IO', title: 'Communication',
    description: 'Convey and receive information and intent accurately, in the form the audience needs.',
    levels: [
      { band: 1, descriptor: 'Communicate clearly in routine situations and check that you have been understood.',
        behaviours: ['Writes and speaks without ambiguity', 'Listens for meaning, not just words', 'Confirms understanding before acting'] },
      { band: 2, descriptor: 'Adapt message, medium and framing to different audiences, including difficult ones.',
        behaviours: ['Tailors technical content for non-specialists', 'Handles disagreement without escalation', 'Structures a case, not just facts'] },
      { band: 3, descriptor: 'Communicate on behalf of the organisation on complex or contested matters.',
        behaviours: ['Represents position under scrutiny', 'Sets communication strategy and standards', 'Manages message through crisis'] },
    ],
  },
  {
    code: 'CCS-CUS', cluster: 'IO', title: 'Customer Orientation',
    description: 'Anticipate and meet the needs of internal and external customers to build lasting relationships.',
    levels: [
      { band: 1, descriptor: 'Serve customers within established standards and refer what you cannot resolve.',
        behaviours: ['Follows service standards consistently', 'Records customer needs accurately', 'Escalates with full context'] },
      { band: 2, descriptor: 'Anticipate customer needs and improve the service based on what you observe.',
        behaviours: ['Identifies unstated needs', 'Recovers a failed service experience', 'Feeds insight back into process change'] },
      { band: 3, descriptor: 'Set customer strategy and design the operating model that delivers it.',
        behaviours: ['Defines the service proposition', 'Balances customer value against cost to serve', 'Builds a customer-centred culture'] },
    ],
  },
  {
    code: 'CCS-DEV', cluster: 'IO', title: 'Developing People',
    description: 'Help others build capability through coaching, feedback and deliberate opportunity.',
    levels: [
      { band: 1, descriptor: 'Support colleagues by sharing knowledge and giving specific, usable feedback.',
        behaviours: ['Explains own work so others can repeat it', 'Gives feedback on behaviour, not person', 'Onboards new colleagues willingly'] },
      { band: 2, descriptor: 'Coach individuals against a development plan and create stretch opportunities.',
        behaviours: ['Diagnoses a capability gap accurately', 'Delegates for development, not just load', 'Holds honest development conversations'] },
      { band: 3, descriptor: 'Build organisational capability and succession ahead of need.',
        behaviours: ['Plans succession for critical roles', 'Invests in capability before it is urgent', 'Develops other developers of people'] },
    ],
  },
  {
    code: 'CCS-INF', cluster: 'IO', title: 'Influence',
    description: 'Shape the decisions and behaviour of others without relying on formal authority.',
    levels: [
      { band: 1, descriptor: 'Present a reasoned case and respond to straightforward objections.',
        behaviours: ['Backs a position with evidence', 'Understands the other party’s interest', 'Accepts a decision that goes the other way'] },
      { band: 2, descriptor: 'Build support across stakeholders with differing priorities.',
        behaviours: ['Maps stakeholders and their interests', 'Sequences conversations to build momentum', 'Trades and concedes deliberately'] },
      { band: 3, descriptor: 'Shape agendas and outcomes at senior and cross-organisational level.',
        behaviours: ['Sets the terms of a debate', 'Builds coalitions across institutions', 'Influences through others over long horizons'] },
    ],
  },
  {
    code: 'CCS-ADP', cluster: 'SR', title: 'Adaptability',
    description: 'Adjust readily to changing conditions, expectations and ways of working.',
    levels: [
      { band: 1, descriptor: 'Adjust to changes in task and process with support, keeping performance steady.',
        behaviours: ['Accepts changed priorities without disruption', 'Asks what the change means for own work', 'Recovers quickly from setbacks'] },
      { band: 2, descriptor: 'Reorganise your own and your team’s work in response to change and help others through it.',
        behaviours: ['Re-plans quickly when conditions shift', 'Keeps others steady during change', 'Distinguishes what must change from what must not'] },
      { band: 3, descriptor: 'Lead the organisation through discontinuous change and build resilience for the next one.',
        behaviours: ['Prepares the organisation before change is forced', 'Sustains performance through transition', 'Designs for optionality and reversibility'] },
    ],
  },
  {
    code: 'CCS-DIG', cluster: 'SR', title: 'Digital Fluency',
    description: 'Use the right digital tools across work processes to solve problems, drive efficiency and share information.',
    levels: [
      { band: 1, descriptor: 'Use standard digital tools for daily work and follow data and security practice.',
        behaviours: ['Works confidently in core workplace tools', 'Handles data according to policy', 'Recognises common digital risks'] },
      { band: 2, descriptor: 'Select and combine digital tools to improve a process, including automation and analysis.',
        behaviours: ['Automates repetitive work', 'Interprets data to inform decisions', 'Evaluates a tool against a real need'] },
      { band: 3, descriptor: 'Set digital direction for a function and lead adoption of new technology.',
        behaviours: ['Prioritises digital investment against value', 'Leads change management for adoption', 'Governs data, AI and security standards'] },
    ],
  },
  {
    code: 'CCS-GLB', cluster: 'SR', title: 'Global Perspective',
    description: 'Understand global and regional dynamics and work effectively across markets and cultures.',
    levels: [
      { band: 1, descriptor: 'Recognise how global and regional developments affect your own work.',
        behaviours: ['Follows developments relevant to the sector', 'Works respectfully across cultures', 'Understands basic market differences'] },
      { band: 2, descriptor: 'Apply market and cultural understanding to decisions involving other countries.',
        behaviours: ['Adapts practice for regional markets', 'Manages distributed and cross-border work', 'Assesses regulatory difference across markets'] },
      { band: 3, descriptor: 'Set strategy that anticipates global shifts and positions the organisation across markets.',
        behaviours: ['Reads geopolitical and trade risk', 'Sets market-entry and localisation strategy', 'Builds international partnerships'] },
    ],
  },
  {
    code: 'CCS-LAG', cluster: 'SR', title: 'Learning Agility',
    description: 'Use different learning approaches to keep capability current and to learn faster from experience.',
    levels: [
      { band: 1, descriptor: 'Take up learning that is provided and apply it to your work.',
        behaviours: ['Completes and applies assigned learning', 'Asks for feedback and acts on it', 'Keeps a record of what was learnt'] },
      { band: 2, descriptor: 'Direct your own learning against identified gaps and choose the right method for each.',
        behaviours: ['Diagnoses own gaps against a target role', 'Chooses between course, practice and mentoring', 'Learns deliberately from failure'] },
      { band: 3, descriptor: 'Build a learning culture and make capability renewal part of how the organisation runs.',
        behaviours: ['Links learning investment to workforce strategy', 'Creates the conditions for on-the-job learning', 'Measures learning by capability change, not attendance'] },
    ],
  },
  {
    code: 'CCS-SLF', cluster: 'SR', title: 'Self Management',
    description: 'Manage your own priorities, wellbeing and professional conduct to sustain performance.',
    levels: [
      { band: 1, descriptor: 'Manage your own workload, time and conduct to meet expectations.',
        behaviours: ['Plans and meets commitments', 'Maintains professional conduct under pressure', 'Recognises own stress signals'] },
      { band: 2, descriptor: 'Manage competing demands and sustain performance and wellbeing over time.',
        behaviours: ['Prioritises against value, not urgency alone', 'Sets and holds boundaries', 'Seeks support before capacity is exceeded'] },
      { band: 3, descriptor: 'Model and enable sustainable performance for a wider group.',
        behaviours: ['Sets workload norms that hold', 'Acts on wellbeing signals in the team', 'Sustains judgement in prolonged pressure'] },
    ],
  },
];
