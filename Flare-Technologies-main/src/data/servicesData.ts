export type SubService = {
  title: string;
  slug: string;
  shortDesc: string;
  process: string[];
  benefits: string[];
  heroHeadline: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  subServices: SubService[];
};

export const servicesData: ServiceCategory[] = [
  {
    id: "automated-systems",
    name: "Automated Systems",
    description: "We help businesses streamline operations by automating repetitive tasks and improving efficiency through intelligent systems.",
    subServices: [
      {
        title: "Process Automation",
        slug: "process-automation",
        shortDesc: "Eliminate manual data entry and repetitive workflows.",
        heroHeadline: "Scale Your Output Without Scaling Your Headcount",
        process: [
          "Discovery: We audit your daily manual tasks to identify high-ROI automation targets.",
          "Design: We architect custom workflow scripts that connect your existing applications.",
          "Deployment: We launch and rigorously test the automation pipelines without business interruption."
        ],
        benefits: ["Reduce human error by 99%", "Save hundreds of weekly hours", "Accelerate turn-around times"]
      },
      {
        title: "AI Chatbots & Digital Agents",
        slug: "ai-chatbots",
        shortDesc: "Deploy 24/7 intelligent agents to handle support and sales.",
        heroHeadline: "Deliver Instant Support and Capture Leads Around the Clock",
        process: [
          "Knowledge Training: We train AI models specifically on your company's proprietary data and brand voice.",
          "Platform Integration: Omni-channel deployment across your Website, WhatsApp, and social inboxes.",
          "Continuous Learning: We set up feedback loops to continuously improve response accuracy over time."
        ],
        benefits: ["24/7 immediate customer response", "Automatic lead qualification", "Significantly lower support costs"]
      },
      {
        title: "Workflow Automation",
        slug: "workflow-automation",
        shortDesc: "Connect disparate apps into seamless, robust pipelines.",
        heroHeadline: "Create Flawless Systems That Talk To Each Other",
        process: [
          "Mapping: Visualizing cross-platform operations and uncovering bottlenecks.",
          "Integration: Utilizing enterprise APIs to trigger events safely between systems.",
          "Execution: Creating structured logic rules for routing, approvals, and notifications."
        ],
        benefits: ["Eradicate operational silos", "Accelerate cross-department communication", "Eliminate redundant software licenses"]
      },
      {
        title: "CRM Automation",
        slug: "crm-automation",
        shortDesc: "Supercharge your CRM to execute follow-ups automatically.",
        heroHeadline: "Close More Deals With an Intelligent Pipeline",
        process: [
          "Database Architecture: Structuring data taxonomies and cleaning up legacy records.",
          "Pipeline Automation: Setting up automated lead-scoring, activity tracking, and drip campaigns.",
          "Optimization: Configuring role-based dashboards to give leaders actionable sales analytics."
        ],
        benefits: ["Never drop a hot lead again", "Predictable sales forecasting", "Focus sales reps on selling, not admin"]
      },
      {
        title: "Business Process Optimization",
        slug: "business-process-optimization",
        shortDesc: "Rebuild legacy frameworks into high-performance standard procedures.",
        heroHeadline: "Redesign Your Business Engine for Maximum Efficiency",
        process: [
          "Audit: Strategic evaluation of current standard operating procedures and resource drains.",
          "Redesign: Crafting lean, agile structural blueprints utilizing modern technology stacks.",
          "Implementation: Managed rollout, comprehensive team training, and change management."
        ],
        benefits: ["Unlock trapped profit margins", "Drastically shorten product delivery cycles", "Enable sustainable scaling infrastructure"]
      }
    ]
  },
  {
    id: "engineering",
    name: "Engineering & Development",
    description: "We design and build reliable, scalable digital products and infrastructure tailored to business needs.",
    subServices: [
      {
        title: "Custom Software Development",
        slug: "custom-software",
        shortDesc: "Build bespoke applications tailored strictly to your operations.",
        heroHeadline: "Digital Products Built Precisely for Your Objectives",
        process: [
          "Requirements: Deep architectural planning and scoping to match your business logic.",
          "Sprint Development: Agile, iterative coding using modern, clean technology paradigms.",
          "QA & Launch: Comprehensive unit testing, security audits, and a seamless deployment."
        ],
        benefits: ["100% proprietary code ownership", "Zero compromises on features", "Infinitely scalable architecture"]
      },
      {
        title: "Web Application Development",
        slug: "web-apps",
        shortDesc: "Interactive web portals and responsive platforms.",
        heroHeadline: "Engaging Web Platforms That Perform at Scale",
        process: [
          "Wireframing: User journey mapping and high-fidelity prototype formulation.",
          "Engineering: Specialized front-end rendering combined with secure server-side logic.",
          "Optimization: Intense performance profiling to ensure millisecond load times globally."
        ],
        benefits: ["Flawless multi-device experience", "SEO-ready technical foundations", "State-of-the-art framework security"]
      },
      {
        title: "AI Automation Systems",
        slug: "ai-systems",
        shortDesc: "Embed machine learning straight into your software.",
        heroHeadline: "Inject True Intelligence Into Your Software",
        process: [
          "Vendor Selection: Identifying the correct LLM or visual model for your specific use-case.",
          "Integration: Training the custom engine and bridging it via API into existing software.",
          "Refinement: Establishing guardrails, prompt optimization, and monitoring inference costs."
        ],
        benefits: ["Automate complex cognitive tasks", "Identify predictive data trends", "Dramatically outpace legacy competitors"]
      },
      {
        title: "SaaS Product Development",
        slug: "saas-development",
        shortDesc: "Go from concept to a commercially ready multi-tenant product.",
        heroHeadline: "Launch the Next Generation of SaaS Applications",
        process: [
          "MVP Scoping: Distilling the core value proposition for rapid market entry.",
          "Architecture: Building out robust multi-tenant databases and complex subscription logic.",
          "Deployment: Configuring scalable cloud hosting capable of massive user spikes."
        ],
        benefits: ["Accelerated time-to-market", "Enterprise-grade data segmentation", "Built-in monetization ecosystems"]
      },
      {
        title: "Cloud Architecture & DevOps",
        slug: "cloud-architecture",
        shortDesc: "Modernize your infrastructure for ultimate stability.",
        heroHeadline: "Resilient Infrastructure for Unstoppable Applications",
        process: [
          "Assessment: Evaluating current infrastructure for vulnerabilities and cost inefficiencies.",
          "Pipeline Creation: Automating CI/CD deployment logic for continuous safe updates.",
          "Migration: Performing zero-downtime server and database migrations to modern providers."
        ],
        benefits: ["99.99% uptime guarantees", "Minimize server resource costs", "Military-grade data protection"]
      },
      {
        title: "Backend Development & API",
        slug: "backend-api",
        shortDesc: "Strong and secure foundations to power your applications.",
        heroHeadline: "Bulletproof Backends and Fluid Data Architectures",
        process: [
          "Modeling: Orchestrating highly optimized database relationships and queries.",
          "Endpoint Creation: Building secure, documented REST or GraphQL programmatic interfaces.",
          "Connections: Facilitating deep third-party system handshakes and integrations."
        ],
        benefits: ["Handle millions of requests securely", "Instant data retrieval", "Future-proof core architecture"]
      }
    ]
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    description: "We support businesses in expanding their reach, improving visibility, and increasing conversions through strategic marketing solutions.",
    subServices: [
      {
        title: "Digital Marketing Strategy",
        slug: "marketing-strategy",
        shortDesc: "Comprehensive roadmaps to capture targeted market share.",
        heroHeadline: "Data-Driven Roadmaps Designed Purely for Growth",
        process: [
          "Research: Extensive market analysis and detailed competitor profiling.",
          "Funnel Design: Planning multi-channel ad touchpoints from awareness to conversion.",
          "Tracking: Executing transparent analytics reporting to measure true ROI."
        ],
        benefits: ["Lower customer acquisition costs", "Higher lifetime value", "Clear attribution for every dollar spent"]
      },
      {
        title: "Performance Marketing",
        slug: "performance-marketing",
        shortDesc: "Aggressive, conversion-focused paid ad campaigns.",
        heroHeadline: "Turn Ad Spend Into Predictable Revenue",
        process: [
          "Targeting: Building granular, hyper-qualified audience segments.",
          "Creative & Bidding: Generating high-converting assets and managing automated daily bid strategies.",
          "Scale: Relentless A/B testing to uncover the most profitable campaigns to rapidly scale."
        ],
        benefits: ["Massive traffic volume instantly", "High-urgency lead generation", "Agile budget recalibration"]
      },
      {
        title: "Search Engine Optimization (SEO)",
        slug: "seo",
        shortDesc: "Dominate search rankings through technical mastery.",
        heroHeadline: "Capture High-Intent Organic Traffic Predictably",
        process: [
          "Technical Audit: Repairing indexation blocks, site speed constraints, and schema markup.",
          "Content Mapping: Targeting lucrative long-tail keywords with elite content assets.",
          "Authority Context: Launching ethical, high-authority backlinking campaigns."
        ],
        benefits: ["Compound traffic growth", "Establish absolute industry authority", "Reduce reliance on paid ads"]
      },
      {
        title: "Brand Identity & Positioning",
        slug: "brand-identity",
        shortDesc: "Crafting premium visual identities that demand respect.",
        heroHeadline: "Design a Brand That Commands Undeniable Premium Value",
        process: [
          "Discovery: Extracting the core ethos and strategic market positioning of your company.",
          "Visual Design: Architecting a meticulous logo, typography, color, and voice system.",
          "Guidelines: Compiling exhaustive brand manuals to guarantee consistent omnichannel execution."
        ],
        benefits: ["Instantly build market trust", "Justify higher product pricing", "Differentiate from saturated competition"]
      },
      {
        title: "Conversion Rate Optimization",
        slug: "cro",
        shortDesc: "Fix the leaks in your funnel to maximize existing traffic.",
        heroHeadline: "Extract Maximum Value From the Traffic You Already Have",
        process: [
          "Analytics: Deploying session recording and advanced heatmap scrutiny.",
          "Friction Removal: Redesigning complex UI elements causing abandonment.",
          "Multivariate Testing: Running persistent split tests on headlines, layouts, and CTAs."
        ],
        benefits: ["Increase sales without more ad spend", "Dramatically lower bounce rates", "Smoother customer purchasing journeys"]
      },
      {
        title: "E-commerce Growth",
        slug: "ecommerce-growth",
        shortDesc: "Scale your storefront horizontally and vertically.",
        heroHeadline: "Exploit the Full Potential of Your Digital Storefront",
        process: [
          "Storeframe Setup: Rebuilding product catalogs for maximum loading velocity and trust.",
          "Retention Engine: Launching cart-abandonment systems and lifecycle email funnels.",
          "Upselling: Implementing strategic post-purchase offers and high-LTV retargeting."
        ],
        benefits: ["Maximize average order value", "Generate recurring loyal purchases", "Outperform market standard conversion rates"]
      }
    ]
  },
  {
    id: "consulting",
    name: "Consulting & Strategy",
    description: "We provide expert guidance to help businesses implement the right systems and strategies for long-term growth.",
    subServices: [
      {
        title: "AI Implementation Strategy",
        slug: "ai-strategy",
        shortDesc: "Determine exactly where AI will be most profitable for you.",
        heroHeadline: "Navigate the AI Revolution With Total Confidence",
        process: [
          "Viability Assessment: Identifying internal friction points that LLMs or agents can solve immediately.",
          "Vendor Selection: Analyzing open-source vs enterprise AI models suited for data privacy requirements.",
          "Roadmap: Drafting step-by-step technological timelines to implement AI safely without disruption."
        ],
        benefits: ["Avoid costly hype-investments", "Develop an unbeatable competitive moat", "Ensure rigid data security compliance"]
      },
      {
        title: "Automation Audit",
        slug: "automation-audit",
        shortDesc: "Discover hidden efficiencies trapped inside your team's workflow.",
        heroHeadline: "Uncover the Hidden Bottlenecks Costing You Margins",
        process: [
          "Review: Complete, non-invasive observation of manual operations and cross-team transitions.",
          "Identification: Flagging severe redundancies, data-entry waste, and software capability gaps.",
          "Projection: Presenting a quantitative ROI analysis proving the impact of automating specific functions."
        ],
        benefits: ["Actionable intelligence on operations", "Clear path to lean structuring", "Immediate cost-saving revelations"]
      },
      {
        title: "Business Systems Design",
        slug: "systems-design",
        shortDesc: "Design holistic, integrated enterprise frameworks.",
        heroHeadline: "Architect Bulletproof Tech Stacks Built for the Enterprise",
        process: [
          "Structural Mapping: Tracing cross-departmental data flow and tool utilization.",
          "Blueprinting: Recommending refined, deeply integrated tech stacks tailored to enterprise scale.",
          "Change Management: Providing the rigorous oversight and team training required to adopt new systems."
        ],
        benefits: ["Unify fragmented company data", "Vastly improve inter-department collaboration", "Future-proof against legacy technical debt"]
      }
    ]
  }
]; 
