import { SplineHero } from "@/components/SplineHero"
import GrowthStack from "@/components/GrowthStack"
import WhyFlare from "@/components/WhyFlare"
import TrustedBy from "@/components/TrustedBy"
import WhoWeAre from "@/components/WhoWeAre"
import SEO from "@/components/SEO"

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Flare Technologies",
  "url": "https://www.flaretechnologies.in",
  "logo": "https://www.flaretechnologies.in/logo.webp",
  "description": "India's First B2B Technical Marketing Company",
  "foundingDate": "2024",
  "foundingLocation": "Bengaluru, Karnataka, India",
  "areaServed": ["Bengaluru", "India"],
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "2-10"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "HSR Layout",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-78991-04311",
    "contactType": "customer service",
    "email": "marketing@flaretechnologies.in"
  },
  "sameAs": [
    "https://www.linkedin.com/company/flaretechnologiespvtltd/",
    "https://www.instagram.com/flare_technologies/"
  ]
};

// WebSite schema with SearchAction pointing to /results
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.flaretechnologies.in",
  "name": "Flare Technologies",
  "description": "India's First B2B Technical Marketing Company — web development, AI automation, and growth marketing for B2B businesses in Bengaluru, India.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.flaretechnologies.in/results?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Services offered — shown on homepage for search engine context
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Flare Technologies Services",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Automated Systems", "url": "https://www.flaretechnologies.in/main-services/automated-systems" },
    { "@type": "ListItem", "position": 2, "name": "Engineering & Development", "url": "https://www.flaretechnologies.in/main-services/engineering-development" },
    { "@type": "ListItem", "position": 3, "name": "Growth & Marketing", "url": "https://www.flaretechnologies.in/main-services/growth-marketing" },
    { "@type": "ListItem", "position": 4, "name": "Consulting & Strategy", "url": "https://www.flaretechnologies.in/main-services/consulting-strategy" },
    { "@type": "ListItem", "position": 5, "name": "Cloud Infrastructure", "url": "https://www.flaretechnologies.in/main-services/cloud-infrastructure" },
    { "@type": "ListItem", "position": 6, "name": "AI Solutions", "url": "https://www.flaretechnologies.in/main-services/ai-solutions" },
    { "@type": "ListItem", "position": 7, "name": "B2B Partnerships", "url": "https://www.flaretechnologies.in/main-services/b2b-partnerships" },
  ]
};

interface HomeProps {
    openModal: () => void;
}

export default function Home({ openModal: _openModal }: HomeProps) {
    return (
        <main>
            <SEO
                title="India's First B2B Technical Marketing Company | Flare Technologies"
                description="Flare Technologies helps B2B companies grow with technical marketing — content engineering, automation, and video production from Bengaluru, India."
                canonical="https://www.flaretechnologies.in/"
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
            <SplineHero />
            <GrowthStack />
            <WhyFlare />
            <TrustedBy />
            <WhoWeAre />
        </main>
    );
}
