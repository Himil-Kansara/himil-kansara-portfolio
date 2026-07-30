import { Portfolio } from "@/components/Portfolio";
import { portfolioConfig } from "@/data/profile";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolioConfig.name,
    jobTitle: portfolioConfig.title,
    email: portfolioConfig.email,
    telephone: portfolioConfig.phone,
    address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
    sameAs: [portfolioConfig.linkedin, portfolioConfig.github],
    knowsAbout: ["Angular", "React", "TypeScript", ".NET Core", "Azure", "REST APIs"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Portfolio />
    </>
  );
}
