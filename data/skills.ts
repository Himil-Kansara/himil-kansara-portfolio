import type { Skill } from "@/types/portfolio";

const core = new Set(["Angular","React","JavaScript","TypeScript","HTML5","CSS3","SCSS","C#",".NET Core","ASP.NET Web API","Node.js","SQL Server","Microsoft Azure","REST APIs","Git","Azure DevOps","CI/CD","Responsive Design","Performance Optimisation"]);
const strong = new Set(["Tailwind CSS","RxJS","NgRx","Accessibility","Express.js","Authentication","Role-based authorisation","Entity Framework Core","Azure App Service","Application Insights","Postman","Swagger","Visual Studio","Visual Studio Code","Agile Scrum"]);
const groups: Record<string, string[]> = {
  Frontend: ["Angular","React","JavaScript","TypeScript","HTML5","CSS3","SCSS","Tailwind CSS","RxJS","NgRx","Responsive Design","Accessibility","Performance Optimisation"],
  Backend: ["C#",".NET Core","ASP.NET Web API","Node.js","Express.js","REST APIs","Authentication","Role-based authorisation"],
  Database: ["SQL Server","PostgreSQL","MongoDB","Entity Framework Core"],
  "Cloud & DevOps": ["Microsoft Azure","Azure App Service","Azure Functions","Azure Storage","Azure Service Bus","Azure Key Vault","Application Insights","Azure DevOps","GitHub Actions","CI/CD","Docker"],
  "Testing & Tools": ["Jest","Jasmine","Karma","Playwright","Postman","Swagger","Git","Visual Studio","Visual Studio Code","Agile Scrum"],
};
export const skills: Skill[] = Object.entries(groups).flatMap(([category, names]) => names.map((name) => ({
  name, category,
  level: core.has(name) ? "Core expertise" : strong.has(name) ? "Strong experience" : "Working knowledge",
  description: `Used to build, integrate, test, or operate maintainable ${category.toLowerCase()} solutions.`,
})));
