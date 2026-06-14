// content.jsx — single source of truth for portfolio data + small renderers.
// Both the CLI commands and the IDE editor pull from here.

const VINOD = {
  name: 'Vinod V',
  role: 'Senior Software Engineer',
  location: 'Hyderabad, Telangana, India',
  email: 'vvinodgopal@gmail.com',
  phone: '+91 86865 61728',
  site: 'vinodgopal.dev',
  github: 'github.com/vinodv',
  linkedin: 'linkedin.com/in/vinodv',
  yearsExp: '7+',
  summary:
    "Innovative Software Engineer with 7+ years of expertise in React.js, Vue.js, " +
    "Node.js, and modern JavaScript frameworks. Proven track record of designing " +
    "and implementing scalable solutions across diverse projects, from microfrontend " +
    "architectures to enterprise-level applications. Recognized for exceptional " +
    "client service and technical leadership.",
};

const EXPERIENCE = [
  {
    company: 'Moody\'s',
    role: 'Senior Software Engineer',
    range: '05/2025 — present',
    location: 'Hyderabad',
    blurb: 'Credit ratings, research & risk-management for global capital and commodity markets.',
    bullets: [
      'Architecting & developing modern web apps in React, Vue 2, TypeScript, Node — financial analytics & risk-assessment platforms.',
      'Cross-functional collaboration on scalable microservices and robust API solutions.',
      'Optimizing app performance and DX through code review, refactoring, best-practice rollout.',
    ],
    stack: ['React','Vue 2','TypeScript','Node','Microservices'],
    file: 'moodys.md',
    color: '#7ed957',
    current: true,
  },
  {
    company: 'EY GDS',
    role: 'Senior Technical Lead',
    range: '03/2023 — 05/2025',
    location: 'Hyderabad',
    blurb: 'Global leader in assurance, tax, transaction & advisory services.',
    bullets: [
      'Designed & implemented a microfrontend solution for existing TypeScript React apps — improved scalability + modularity.',
      'Built a reusable bootstrap framework aligned with the microfrontend architecture.',
      'Configurable OAuth 2.0 auth system supporting multiple IDPs in Node.',
      'Worked with Azure AI services — AI Search, Translator, Document Translation.',
    ],
    stack: ['React','TypeScript','Node','OAuth 2.0','Azure AI','Microfrontends'],
    awards: ['Exceptional Client Service ×2'],
    file: 'ey-gds.md',
    color: '#7aa9d8',
  },
  {
    company: 'Infosys',
    role: 'Specialist Programmer',
    range: '06/2021 — 03/2023',
    location: 'Hyderabad',
    blurb: 'Global leader in next-generation digital services & consulting.',
    bullets: [
      'Designed & built an auditing tool with complex business logic in React, Redux, Node, Hapi, PostgreSQL, Redis.',
      'Application-level search via Elasticsearch + Azure Cognitive Search; scheduled exports via cron.',
      'Optimized backend APIs in Hapi.js for seamless data processing.',
    ],
    stack: ['React','Redux','Node','Hapi.js','PostgreSQL','Redis','Elasticsearch'],
    file: 'infosys.md',
    color: '#c46a5a',
  },
  {
    company: 'Mindtree',
    role: 'Senior Software Engineer',
    range: '01/2019 — 06/2021',
    location: 'Chennai',
    blurb: 'Global technology consulting & services company.',
    bullets: [
      'Maintained & improved core frameworks for React, Next.js, Gatsby, Node apps.',
      'Automated content upload to CMS via Node scripts.',
      'Optimized existing apps — perf tuning + code-quality fixes.',
      'Direct customer collaboration through full project lifecycle — improved user satisfaction by 40%.',
    ],
    stack: ['React','Next.js','Gatsby','Node'],
    awards: ['Outstanding Contributor — Mindtree'],
    file: 'mindtree.md',
    color: '#c9a86b',
  },
];

const SKILLS = [
  { name: 'React.js',       pct: 94, years: 7 },
  { name: 'Node.js',        pct: 90, years: 7 },
  { name: 'TypeScript',     pct: 86, years: 5 },
  { name: 'JavaScript',     pct: 96, years: 7 },
  { name: 'Vue.js',         pct: 82, years: 5 },
  { name: 'Redux',          pct: 80, years: 6 },
  { name: 'Next.js',        pct: 75, years: 4 },
  { name: 'Gatsby.js',      pct: 70, years: 3 },
  { name: 'Hapi.js',        pct: 65, years: 2 },
  { name: 'PostgreSQL',     pct: 60, years: 3 },
  { name: 'Redis',          pct: 55, years: 3 },
  { name: 'MySQL',          pct: 55, years: 3 },
  { name: 'Elasticsearch',  pct: 50, years: 2 },
  { name: 'Azure',          pct: 72, years: 3 },
  { name: 'AWS',            pct: 58, years: 2 },
  { name: 'OAuth 2.0',      pct: 78, years: 3 },
  { name: 'Microservices',  pct: 75, years: 4 },
  { name: 'Microfrontends', pct: 88, years: 2 },
];

const AWARDS = [
  { title: 'Exceptional Client Service Award (×2)', org: 'EY GDS', year: '2024',
    note: 'Awarded twice in a single year for outstanding client outcomes.' },
  { title: 'Outstanding Contributor', org: 'Mindtree', year: '2020',
    note: 'For consistent contribution & technical leadership.' },
  { title: 'Key Contributor — P&G websites', org: 'Mindtree × P&G', year: '2020',
    note: 'Design + implementation of new features across the P&G web stack.' },
];

const PROJECTS = [
  { name: 'Microfrontend bootstrap',
    where: 'EY GDS', year: '2024',
    blurb: 'Reusable bootstrap framework for spinning up new microfrontends — auth, routing, shell, IDP plugins.',
    stack: ['React','TypeScript','Microfrontends'] },
  { name: 'Multi-IDP OAuth 2.0 auth',
    where: 'EY GDS', year: '2023',
    blurb: 'Configurable Node service that brokers OAuth 2.0 across multiple identity providers.',
    stack: ['Node','OAuth 2.0'] },
  { name: 'Auditing tool',
    where: 'Infosys', year: '2022',
    blurb: 'End-to-end auditing app with complex business logic — React/Redux UI + Hapi/Postgres/Redis backend.',
    stack: ['React','Redux','Hapi.js','PostgreSQL','Redis','Elasticsearch'] },
  { name: 'P&G CMS automation',
    where: 'Mindtree × P&G', year: '2020',
    blurb: 'Node automation that bulk-uploads CMS content; user-satisfaction lift of +40% across the P&G web estate.',
    stack: ['Node','Gatsby','Next.js'] },
];

const EDUCATION = {
  degree: 'B.Tech',
  school: 'Mahatma Gandhi Institute of Technology (MGIT)',
  range: '08/2014 — 07/2018',
  location: 'Hyderabad',
};

const CERTIFICATIONS = [
  'Microfrontend with React — Udemy',
  'EV Artificial Intelligence: AI Engineering — EV',
];

Object.assign(window, {
  VINOD, EXPERIENCE, SKILLS, AWARDS, PROJECTS, EDUCATION, CERTIFICATIONS,
});
