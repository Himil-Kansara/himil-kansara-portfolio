export type Level = "Core expertise" | "Strong experience" | "Working knowledge";
export interface Skill { name: string; category: string; level: Level; description: string }
export interface Experience { company: string; role: string; duration: string; location: string; summary: string; achievements: string[]; technologies: string[]; placeholder?: boolean }
export interface Project { slug: string; title: string; description: string; problem: string; contribution: string; features: string[]; technologies: string[]; architecture: string; challenges: string[]; githubUrl: string; liveUrl: string; image: string; category: string; featured: boolean; placeholder?: boolean }
export interface Testimonial { name: string; designation: string; company: string; testimonial: string; image: string; placeholder?: boolean }
