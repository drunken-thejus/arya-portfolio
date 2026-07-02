/**
 * Data access layer — all reads and writes go through Supabase JS client.
 * Function signatures are identical to the previous fetch-based version so
 * all existing components continue to work without changes.
 */
import { supabase } from "./supabase";
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

// ── Kept for backwards-compat (server-data.ts imports it) ────────
export const API_URL = "";
export function getToken() { return null; }
export function setToken(_t: string) { return; }
export function clearToken() { return; }

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

// Simple client-side slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function throwOnError<T>(
  promise: PromiseLike<{ data: T | null; error: { message: string } | null }>
): Promise<T> {
  const { data, error } = await promise;
  if (error) throw new ApiError(error.message);
  return data as T;
}

// ── Singleton helpers (hero / about have exactly one row) ─────────
async function getSingleton<T>(table: string): Promise<T> {
  const { data, error } = await supabase.from(table).select("*").limit(1).single();
  if (error && error.message.includes("0 rows")) {
    // Row doesn't exist yet — return empty object
    return {} as T;
  }
  if (error) throw new ApiError(error.message);
  return data as T;
}

async function upsertSingleton<T>(table: string, payload: Partial<T>): Promise<T> {
  // Fetch existing row id (if any) so we upsert rather than insert.
  const { data: existing } = await supabase.from(table).select("id").limit(1).single();
  const id = (existing as { id?: number } | null)?.id ?? 1;
  const { data, error } = await supabase
    .from(table)
    .upsert({ id, ...payload })
    .select()
    .single();
  if (error) throw new ApiError(error.message);
  return data as T;
}

// ──────────────────────────────────────────────────────────────────
export const api = {
  // ── Public reads ──────────────────────────────────────────────
  getHero: () => getSingleton<Hero>("hero"),
  getAbout: () => getSingleton<About>("about"),

  getServices: () =>
    throwOnError<Service[]>(
      supabase.from("services").select("*").order("order").order("id")
    ),

  getCategories: () =>
    throwOnError<Category[]>(
      supabase.from("categories").select("*").order("name")
    ),

  getWorks: async (params?: { category?: string; featured?: boolean }) => {
    let q = supabase
      .from("works")
      .select("*, category:categories(*), images:work_images(*)")
      .eq("is_published", true)
      .order("order")
      .order("created_at", { ascending: false });

    if (params?.featured !== undefined) q = q.eq("is_featured", params.featured);
    if (params?.category) {
      // filter by category slug via join
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", params.category)
        .single();
      if (cat) q = q.eq("category_id", (cat as { id: number }).id);
    }
    return throwOnError<Work[]>(q);
  },

  getWork: (slug: string) =>
    throwOnError<Work>(
      supabase
        .from("works")
        .select("*, category:categories(*), images:work_images(*)")
        .eq("slug", slug)
        .single()
    ),

  getExperience: () =>
    throwOnError<Experience[]>(
      supabase.from("experience").select("*").order("order").order("id")
    ),

  getTestimonials: () =>
    throwOnError<Testimonial[]>(
      supabase.from("testimonials").select("*").order("order").order("id")
    ),

  getSocials: () =>
    throwOnError<SocialLink[]>(
      supabase.from("social_links").select("*").order("order").order("id")
    ),

  submitContact: async (data: ContactInput) =>
    throwOnError<Message>(
      supabase.from("messages").insert(data).select().single()
    ),

  // ── Auth (Supabase Auth) ───────────────────────────────────────
  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new ApiError(error.message, 401);
    return { access_token: "supabase-session" };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  me: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new ApiError("Not authenticated", 401);
    return {
      id: 0,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? user.email ?? "Admin",
    };
  },

  // ── Dashboard ─────────────────────────────────────────────────
  getDashboard: async (): Promise<DashboardStats> => {
    const [works, services, testimonials, experience, messages, recentMsgs, recentWorks] =
      await Promise.all([
        supabase.from("works").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("experience").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id,is_read", { count: "exact" }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("works").select("*, category:categories(*), images:work_images(*)")
          .order("created_at", { ascending: false }).limit(5),
      ]);

    const allMsgs = (messages.data ?? []) as { is_read: boolean }[];
    return {
      total_works: works.count ?? 0,
      total_services: services.count ?? 0,
      total_messages: messages.count ?? 0,
      unread_messages: allMsgs.filter((m) => !m.is_read).length,
      total_testimonials: testimonials.count ?? 0,
      total_experience: experience.count ?? 0,
      recent_messages: (recentMsgs.data ?? []) as Message[],
      recent_works: (recentWorks.data ?? []) as Work[],
    };
  },

  // ── Hero / About (singleton upserts) ──────────────────────────
  updateHero: (data: Partial<Hero>) => upsertSingleton<Hero>("hero", data),
  updateAbout: (data: Partial<About>) => upsertSingleton<About>("about", data),

  // ── Services ──────────────────────────────────────────────────
  createService: (data: Partial<Service>) =>
    throwOnError<Service>(supabase.from("services").insert(data).select().single()),
  updateService: (id: number, data: Partial<Service>) =>
    throwOnError<Service>(supabase.from("services").update(data).eq("id", id).select().single()),
  deleteService: (id: number) =>
    throwOnError<null>(supabase.from("services").delete().eq("id", id)),

  // ── Categories ────────────────────────────────────────────────
  createCategory: async (name: string) => {
    const slug = slugify(name);
    // upsert in case slug already exists
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name, slug }, { onConflict: "slug" })
      .select()
      .single();
    if (error) throw new ApiError(error.message);
    return data as Category;
  },
  deleteCategory: (id: number) =>
    throwOnError<null>(supabase.from("categories").delete().eq("id", id)),

  // ── Works ─────────────────────────────────────────────────────
  adminGetWorks: () =>
    throwOnError<Work[]>(
      supabase
        .from("works")
        .select("*, category:categories(*), images:work_images(*)")
        .order("order")
        .order("created_at", { ascending: false })
    ),

  createWork: async (data: Partial<Work> & { images?: { url: string; caption?: string; order?: number }[] }) => {
    const { images, ...rest } = data;
    const slug = slugify(rest.title ?? "untitled");
    const { data: work, error } = await supabase
      .from("works")
      .insert({ ...rest, slug })
      .select("*, category:categories(*), images:work_images(*)")
      .single();
    if (error) throw new ApiError(error.message);
    if (images?.length) {
      await supabase.from("work_images").insert(
        images.map((img, i) => ({ ...img, work_id: (work as Work).id, order: img.order ?? i }))
      );
    }
    return work as Work;
  },

  updateWork: async (id: number, data: Partial<Work> & { images?: { url: string; caption?: string; order?: number }[] }) => {
    const { images, ...rest } = data;
    if (rest.title) rest.slug = slugify(rest.title);
    const { data: work, error } = await supabase
      .from("works")
      .update(rest)
      .eq("id", id)
      .select("*, category:categories(*), images:work_images(*)")
      .single();
    if (error) throw new ApiError(error.message);
    if (images !== undefined) {
      await supabase.from("work_images").delete().eq("work_id", id);
      if (images.length) {
        await supabase.from("work_images").insert(
          images.map((img, i) => ({ ...img, work_id: id, order: img.order ?? i }))
        );
      }
    }
    return work as Work;
  },

  deleteWork: (id: number) =>
    throwOnError<null>(supabase.from("works").delete().eq("id", id)),

  // ── Experience ────────────────────────────────────────────────
  createExperience: (data: Partial<Experience>) =>
    throwOnError<Experience>(supabase.from("experience").insert(data).select().single()),
  updateExperience: (id: number, data: Partial<Experience>) =>
    throwOnError<Experience>(supabase.from("experience").update(data).eq("id", id).select().single()),
  deleteExperience: (id: number) =>
    throwOnError<null>(supabase.from("experience").delete().eq("id", id)),

  // ── Testimonials ──────────────────────────────────────────────
  createTestimonial: (data: Partial<Testimonial>) =>
    throwOnError<Testimonial>(supabase.from("testimonials").insert(data).select().single()),
  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    throwOnError<Testimonial>(supabase.from("testimonials").update(data).eq("id", id).select().single()),
  deleteTestimonial: (id: number) =>
    throwOnError<null>(supabase.from("testimonials").delete().eq("id", id)),

  // ── Social links ──────────────────────────────────────────────
  createSocial: (data: Partial<SocialLink>) =>
    throwOnError<SocialLink>(supabase.from("social_links").insert(data).select().single()),
  updateSocial: (id: number, data: Partial<SocialLink>) =>
    throwOnError<SocialLink>(supabase.from("social_links").update(data).eq("id", id).select().single()),
  deleteSocial: (id: number) =>
    throwOnError<null>(supabase.from("social_links").delete().eq("id", id)),

  // ── Messages ──────────────────────────────────────────────────
  getMessages: () =>
    throwOnError<Message[]>(
      supabase.from("messages").select("*").order("created_at", { ascending: false })
    ),
  markMessageRead: (id: number, isRead = true) =>
    throwOnError<Message>(
      supabase.from("messages").update({ is_read: isRead }).eq("id", id).select().single()
    ),
  deleteMessage: (id: number) =>
    throwOnError<null>(supabase.from("messages").delete().eq("id", id)),

  // ── File upload (Supabase Storage) ────────────────────────────
  uploadFile: async (file: File, folder = "media") => {
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("portfolio-media")
      .upload(key, file, { upsert: true, contentType: file.type });
    if (error) throw new ApiError(error.message);
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(key);
    return { url: data.publicUrl };
  },
};
