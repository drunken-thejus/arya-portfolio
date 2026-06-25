import type {
  About,
  Category,
  ContactInput,
  DashboardStats,
  Experience,
  Hero,
  Message,
  Service,
  SocialLink,
  Testimonial,
  Work,
} from "./types";

export const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const TOKEN_KEY = "portfolio_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...finalHeaders,
      "ngrok-skip-browser-warning": "true",
    },
    body: payload,
    cache: rest.cache ?? "no-store",
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(
      typeof detail === "string" ? detail : "Request failed",
      res.status
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/* ── Public reads ────────────────────────────────────────────── */
export const api = {
  getHero: () => request<Hero>("/api/hero"),
  getAbout: () => request<About>("/api/about"),
  getServices: () => request<Service[]>("/api/services"),
  getCategories: () => request<Category[]>("/api/categories"),
  getWorks: (params?: { category?: string; featured?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.featured !== undefined) q.set("featured", String(params.featured));
    const qs = q.toString();
    return request<Work[]>(`/api/works${qs ? `?${qs}` : ""}`);
  },
  getWork: (slug: string) => request<Work>(`/api/works/${slug}`),
  getExperience: () => request<Experience[]>("/api/experience"),
  getTestimonials: () => request<Testimonial[]>("/api/testimonials"),
  getSocials: () => request<SocialLink[]>("/api/social"),
  submitContact: (data: ContactInput) =>
    request<Message>("/api/messages", { method: "POST", body: data }),

  /* ── Auth ──────────────────────────────────────────────────── */
  login: async (email: string, password: string) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning": "true",
      },
      body: form,
    });
    if (!res.ok) throw new ApiError("Invalid credentials", res.status);
    const data = (await res.json()) as { access_token: string };
    setToken(data.access_token);
    return data;
  },
  me: () => request<{ id: number; email: string; name: string }>("/auth/me", { auth: true }),

  /* ── Admin writes ──────────────────────────────────────────── */
  getDashboard: () => request<DashboardStats>("/api/dashboard", { auth: true }),

  updateHero: (data: Partial<Hero>) =>
    request<Hero>("/api/hero", { method: "PUT", body: data, auth: true }),
  updateAbout: (data: Partial<About>) =>
    request<About>("/api/about", { method: "PUT", body: data, auth: true }),

  createService: (data: Partial<Service>) =>
    request<Service>("/api/services", { method: "POST", body: data, auth: true }),
  updateService: (id: number, data: Partial<Service>) =>
    request<Service>(`/api/services/${id}`, { method: "PUT", body: data, auth: true }),
  deleteService: (id: number) =>
    request(`/api/services/${id}`, { method: "DELETE", auth: true }),

  createCategory: (name: string) =>
    request<Category>("/api/categories", { method: "POST", body: { name }, auth: true }),
  deleteCategory: (id: number) =>
    request(`/api/categories/${id}`, { method: "DELETE", auth: true }),

  adminGetWorks: () =>
    request<Work[]>("/api/works?include_unpublished=true", { auth: true }),
  createWork: (data: Partial<Work>) =>
    request<Work>("/api/works", { method: "POST", body: data, auth: true }),
  updateWork: (id: number, data: Partial<Work>) =>
    request<Work>(`/api/works/${id}`, { method: "PUT", body: data, auth: true }),
  deleteWork: (id: number) =>
    request(`/api/works/${id}`, { method: "DELETE", auth: true }),

  createExperience: (data: Partial<Experience>) =>
    request<Experience>("/api/experience", { method: "POST", body: data, auth: true }),
  updateExperience: (id: number, data: Partial<Experience>) =>
    request<Experience>(`/api/experience/${id}`, { method: "PUT", body: data, auth: true }),
  deleteExperience: (id: number) =>
    request(`/api/experience/${id}`, { method: "DELETE", auth: true }),

  createTestimonial: (data: Partial<Testimonial>) =>
    request<Testimonial>("/api/testimonials", { method: "POST", body: data, auth: true }),
  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    request<Testimonial>(`/api/testimonials/${id}`, { method: "PUT", body: data, auth: true }),
  deleteTestimonial: (id: number) =>
    request(`/api/testimonials/${id}`, { method: "DELETE", auth: true }),

  createSocial: (data: Partial<SocialLink>) =>
    request<SocialLink>("/api/social", { method: "POST", body: data, auth: true }),
  updateSocial: (id: number, data: Partial<SocialLink>) =>
    request<SocialLink>(`/api/social/${id}`, { method: "PUT", body: data, auth: true }),
  deleteSocial: (id: number) =>
    request(`/api/social/${id}`, { method: "DELETE", auth: true }),

  getMessages: () => request<Message[]>("/api/messages", { auth: true }),
  markMessageRead: (id: number, isRead = true) =>
    request<Message>(`/api/messages/${id}/read?is_read=${isRead}`, {
      method: "PUT",
      auth: true,
    }),
  deleteMessage: (id: number) =>
    request(`/api/messages/${id}`, { method: "DELETE", auth: true }),

  uploadFile: async (file: File, folder = "media") => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    return request<{ url: string }>("/api/upload", {
      method: "POST",
      body: form,
      auth: true,
    });
  },
};
