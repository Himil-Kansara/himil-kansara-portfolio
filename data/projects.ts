import type { Project } from "@/types/portfolio";

const samples = [
  ["enterprise-platform", "Enterprise Angular & .NET Application", "Angular", "A scalable enterprise workflow platform."],
  ["travel-crm", "Travel CRM Platform", "Full Stack", "A unified workspace for travel sales and operations."],
  ["restaurant-ordering", "QR Restaurant Ordering", "React", "A mobile-first contactless ordering experience."],
  ["government-api-marketplace", "Government API Marketplace", ".NET", "A discoverable and governed API catalogue."],
  ["saas-dashboard", "SaaS Operations Dashboard", "SaaS", "A responsive dashboard for operational visibility."],
  ["business-website", "Responsive Business Website", "UI/UX", "A fast, accessible company marketing experience."],
] as const;

const sampleProjects: Project[] = samples.map(([slug, title, category, description], index) => ({
  slug,
  title: `[SAMPLE] ${title}`,
  description: `${description} Editable sample content — replace with verified project details.`,
  problem: "[REPLACE] Describe the real business problem.",
  contribution: "[REPLACE] Describe your verified contribution.",
  features: ["Responsive user journeys", "Reusable interface components", "Reliable API integration"],
  technologies: category === "Angular" ? ["Angular", "TypeScript", ".NET Core"] : category === "React" ? ["React", "TypeScript", "Node.js"] : ["TypeScript", ".NET Core", "Azure"],
  architecture: "[REPLACE] Add the real architecture and technical decisions.",
  challenges: ["[REPLACE] Add a real technical challenge and outcome."],
  githubUrl: "", liveUrl: "", image: "", category, featured: index < 3, placeholder: true,
}));

export const projects: Project[] = [
  {
    slug: "verixo",
    title: "Verixo — Unified Verification API Platform",
    description: "A secure, developer-friendly API SaaS platform that simplifies access to business verification, compliance, and government-related services through a single unified interface.",
    problem: "Businesses often need to integrate multiple verification and compliance services such as GST, PAN, company registration, UDYAM, IFSC, and other APIs from different providers. Managing separate integrations, authentication mechanisms, billing, and usage tracking creates unnecessary complexity.",
    contribution: "Designed and developed a full-stack SaaS platform providing a centralized API marketplace, developer dashboard, API key management, credit-based usage system, authentication, authorization, and administration capabilities.",
    features: [
      "Unified verification and compliance API marketplace",
      "GST, PAN, MCA, UDYAM, IFSC, and business verification APIs",
      "Secure API key generation and management",
      "Credit-based API usage and pricing",
      "Real-time API usage monitoring and analytics",
      "Interactive API documentation and testing",
      "Role-based customer and admin dashboards",
      "Subscription and payment integration",
      "Rate limiting and API security",
      "Scalable external API provider integration",
    ],
    technologies: ["Angular", "TypeScript", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT", "Swagger / OpenAPI"],
    architecture: "Built using the MEAN stack with Angular for the responsive frontend, Node.js and Express.js for REST APIs, and MongoDB for data persistence. The architecture uses a provider abstraction layer to support multiple external API providers while keeping the core application independent and scalable.",
    challenges: [
      "Created a unified integration layer for APIs from different providers while maintaining consistent request and response structures.",
      "Implemented secure API-key authentication, role-based access control, rate limiting, usage tracking, credit deduction, and centralized error handling.",
    ],
    githubUrl: "",
    liveUrl: "",
    image: "",
    category: "Full Stack",
    featured: true,
  },
  ...sampleProjects,
];
