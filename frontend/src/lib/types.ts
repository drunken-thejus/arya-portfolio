export interface Hero {
  id: number;
  name: string;
  headline: string;
  intro: string;
  profile_image: string | null;
  background_image: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_secondary_label: string | null;
  cta_secondary_href: string | null;
}

export interface About {
  id: number;
  biography: string;
  philosophy: string;
  experience_summary: string;
  profile_image: string | null;
  years_experience: number;
  articles_published: number;
  clients_count: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface WorkImage {
  id: number;
  url: string;
  caption: string | null;
  order: number;
}

export interface Work {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  content: string;
  external_link: string | null;
  published_date: string | null;
  tags: string;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  category_id: number | null;
  category: Category | null;
  images: WorkImage[];
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  logo: string | null;
  order: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  profile_image: string | null;
  company: string | null;
  role: string | null;
  message: string;
  order: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
}

export interface DashboardStats {
  total_works: number;
  total_services: number;
  total_messages: number;
  unread_messages: number;
  total_testimonials: number;
  total_experience: number;
  recent_messages: Message[];
  recent_works: Work[];
}

export interface ContactInput {
  name: string;
  email: string;
  subject?: string;
  body: string;
}
