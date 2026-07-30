import type { Project } from "@/types/portfolio";

const samples = [
  ["enterprise-platform","Enterprise Angular & .NET Application","Angular","A scalable enterprise workflow platform."],
  ["travel-crm","Travel CRM Platform","Full Stack","A unified workspace for travel sales and operations."],
  ["restaurant-ordering","QR Restaurant Ordering","React","A mobile-first contactless ordering experience."],
  ["government-api-marketplace","Government API Marketplace",".NET","A discoverable and governed API catalogue."],
  ["saas-dashboard","SaaS Operations Dashboard","SaaS","A responsive dashboard for operational visibility."],
  ["business-website","Responsive Business Website","UI/UX","A fast, accessible company marketing experience."],
] as const;
export const projects: Project[] = samples.map(([slug,title,category,description], index) => ({
  slug, title: `[SAMPLE] ${title}`, description: `${description} Editable sample content — replace with verified project details.`,
  problem: "[REPLACE] Describe the real business problem.", contribution: "[REPLACE] Describe your verified contribution.",
  features: ["Responsive user journeys","Reusable interface components","Reliable API integration"],
  technologies: category === "Angular" ? ["Angular","TypeScript",".NET Core"] : category === "React" ? ["React","TypeScript","Node.js"] : ["TypeScript",".NET Core","Azure"],
  architecture: "[REPLACE] Add the real architecture and technical decisions.",
  challenges: ["[REPLACE] Add a real technical challenge and outcome."],
  githubUrl: "", liveUrl: "", image: "", category, featured: index < 3, placeholder: true,
}));
