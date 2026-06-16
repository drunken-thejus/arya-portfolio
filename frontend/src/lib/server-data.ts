import { api } from "./api";
import type {
  About,
  Category,
  Experience,
  Hero,
  Service,
  SocialLink,
  Testimonial,
  Work,
} from "./types";

const fallbackHero: Hero = {
  id: 0,
  name: "Arya Suresh",
  headline: "Technical Content Writer turning complex engineering into content people actually read.",
  intro:
    "Technical, developer-focused, and SEO/AEO-optimised content. The backend isn't connected yet — set NEXT_PUBLIC_API_URL to see live content.",
  profile_image: null,
  background_image: null,
  cta_primary_label: "View My Work",
  cta_primary_href: "#works",
  cta_secondary_label: "Get in Touch",
  cta_secondary_href: "#contact",
};

const fallbackAbout: About = {
  id: 0,
  biography: "Connect the backend to edit this content from the dashboard.",
  philosophy: "Great writing respects the reader's time.",
  experience_summary: "",
  profile_image: null,
  years_experience: 10,
  articles_published: 480,
  clients_count: 65,
};

export interface SiteData {
  hero: Hero;
  about: About;
  services: Service[];
  works: Work[];
  categories: Category[];
  experience: Experience[];
  testimonials: Testimonial[];
  socials: SocialLink[];
}

/** Fetches all public content in parallel, falling back to defaults on error. */
export async function getSiteData(): Promise<SiteData> {
  const [hero, about, services, works, categories, experience, testimonials, socials] =
    await Promise.all([
      api.getHero().catch(() => fallbackHero),
      api.getAbout().catch(() => fallbackAbout),
      api.getServices().catch(() => [] as Service[]),
      api.getWorks().catch(() => [] as Work[]),
      api.getCategories().catch(() => [] as Category[]),
      api.getExperience().catch(() => [] as Experience[]),
      api.getTestimonials().catch(() => [] as Testimonial[]),
      api.getSocials().catch(() => [] as SocialLink[]),
    ]);

  return { hero, about, services, works, categories, experience, testimonials, socials };
}
