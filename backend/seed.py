"""Seed the database with the first admin user and Arya Suresh's portfolio content.

Run once after configuring .env:
    python seed.py
"""
from datetime import date

from slugify import slugify

from app.database import Base, SessionLocal, engine
from app.models import (
    About,
    Category,
    Experience,
    Hero,
    Service,
    SocialLink,
    Testimonial,
    User,
    Work,
)
from app.config import settings
from app.security import hash_password

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        # ── Admin user ──
        if not db.query(User).filter(User.email == settings.admin_email).first():
            db.add(
                User(
                    email=settings.admin_email,
                    name=settings.admin_name,
                    hashed_password=hash_password(settings.admin_password),
                    is_admin=True,
                )
            )
            print(f"Created admin: {settings.admin_email}")

        # ── Hero ──
        if not db.query(Hero).first():
            db.add(
                Hero(
                    name="Arya Suresh",
                    headline="Technical Content Writer turning complex engineering into content people actually read.",
                    intro="I'm a Technical Web Content Writer specialising in engineering, "
                    "developer-focused, and SEO/AEO-optimised content. I help software "
                    "companies explain what they build — clearly, credibly, and in a way "
                    "that ranks.",
                    cta_primary_label="View My Work",
                    cta_primary_href="#works",
                    cta_secondary_label="Get in Touch",
                    cta_secondary_href="#contact",
                )
            )

        # ── About ──
        if not db.query(About).first():
            db.add(
                About(
                    biography="I'm a Technical Web Content Writer based in Mangaluru, India, with "
                    "a focus on engineering and developer-focused content. As the first in-house "
                    "Technical Writer at Cubet, I built the content function from the ground up — "
                    "researching unfamiliar subjects deeply, structuring them clearly, and turning "
                    "them into impactful, search-optimised content. My work helped bring 100+ "
                    "transactional keywords into SERP ranking and powered a full website revamp.",
                    philosophy="Good technical content isn't about sounding clever — it's about being "
                    "useful. I write to meet both the reader's intent and the search engine's, so "
                    "the result is clear, credible, and impossible to ignore.",
                    experience_summary="Specialising in technical writing, SEO/AEO content strategy, "
                    "and developer-focused documentation across web, mobile, and cloud technologies. "
                    "Certified in web content writing and prompt engineering, and a graduate of "
                    "St. Aloysius College, Mangalore.",
                    years_experience=5,
                    articles_published=250,
                    clients_count=100,
                )
            )

        # ── Services ──
        if db.query(Service).count() == 0:
            services = [
                ("Technical Writing", "Documentation, guides, and explainers that make complex engineering products easy to understand."),
                ("SEO & AEO Content", "Search- and answer-engine-optimised content built to rank — and to win AI-driven search results."),
                ("Developer-Focused Content", "Tutorials, API content, and deep-dives written for technical audiences who can tell the difference."),
                ("Website Copy & Revamp", "End-to-end website content — from information architecture to conversion-focused page copy."),
                ("Blog & Article Writing", "Long-form editorial that builds authority and drives organic, intent-led traffic."),
                ("Content Strategy & Editing", "Keyword research, content planning, and polished, publish-ready editing."),
            ]
            for i, (title, desc) in enumerate(services):
                db.add(Service(title=title, description=desc, order=i))

        # ── Categories + Works ──
        if db.query(Work).count() == 0:
            cats = {}
            for name in [
                "Technical Articles",
                "Case Studies",
                "Developer Guides",
                "SEO Content",
                "Blog Articles",
            ]:
                c = Category(name=name, slug=slugify(name))
                db.add(c)
                cats[name] = c
            db.flush()

            works = [
                (
                    "Ranking 100+ Transactional Keywords: A Content-Led SEO Case Study",
                    "Case Studies",
                    "How a content-first strategy took a software company from invisible to "
                    "first-page rankings across 100+ high-intent keywords.",
                    "<h2>The challenge</h2><p>When I joined as the first in-house technical writer, "
                    "the company's website had strong engineering credentials but almost no organic "
                    "visibility. Transactional, buyer-intent keywords were ranking nowhere.</p>"
                    "<h2>The approach</h2><p>I built a content engine around search intent: clustering "
                    "keywords by the developer and decision-maker journeys, then mapping each cluster "
                    "to a dedicated page or article.</p><ul><li>Keyword and intent research across "
                    "the full funnel</li><li>Technical accuracy via SME interviews with engineers</li>"
                    "<li>On-page SEO and internal linking architecture</li></ul>"
                    "<h2>The result</h2><p>Over 100 transactional keywords entered SERP ranking, and the "
                    "content directly supported a full website revamp.</p>",
                    ["seo", "content-strategy", "case-study", "saas"],
                    True,
                ),
                (
                    "A Developer's Guide to Building Scalable Laravel Applications",
                    "Developer Guides",
                    "Practical patterns for structuring Laravel apps that stay maintainable as "
                    "teams and traffic grow.",
                    "<h2>Why scalability starts with structure</h2><p>Most Laravel performance problems "
                    "aren't about the framework — they're about architecture decisions made early.</p>"
                    "<h3>Service classes over fat controllers</h3><p>Keep controllers thin and move "
                    "business logic into dedicated service classes.</p><h3>Queues for everything slow</h3>"
                    "<p>Email, image processing, and third-party calls belong in queued jobs.</p>"
                    "<h3>Caching with intent</h3><p>Cache query results and computed views, and invalidate "
                    "deliberately.</p>",
                    ["laravel", "php", "backend", "developer"],
                    True,
                ),
                (
                    "AEO vs SEO: Writing Content That Wins in the Age of AI Search",
                    "SEO Content",
                    "Search is shifting from links to answers. Here's how to write content that "
                    "earns the citation, not just the click.",
                    "<h2>From ten blue links to one answer</h2><p>Answer Engine Optimisation (AEO) is "
                    "about being the source an AI model quotes. That changes how we structure content.</p>"
                    "<h2>What AEO rewards</h2><ul><li>Clear, self-contained answers near the top</li>"
                    "<li>Structured data and semantic headings</li><li>Demonstrable expertise and "
                    "citations</li></ul><p>SEO and AEO aren't rivals — the strongest content satisfies "
                    "both the crawler and the model.</p>",
                    ["aeo", "seo", "ai-search", "strategy"],
                    False,
                ),
                (
                    "Demystifying Flutter: Building Cross-Platform Apps That Feel Native",
                    "Technical Articles",
                    "What Flutter actually is, when it's the right call, and how it delivers near-native "
                    "performance from a single codebase.",
                    "<h2>One codebase, two platforms</h2><p>Flutter compiles to native ARM code and "
                    "renders its own UI, which is why it feels fast and consistent across iOS and "
                    "Android.</p><h2>When to choose it</h2><p>Flutter shines for product teams that want "
                    "to ship to both platforms quickly without maintaining two codebases.</p>",
                    ["flutter", "mobile", "cross-platform", "dart"],
                    False,
                ),
                (
                    "Python for the Enterprise: When and Why to Choose It",
                    "Technical Articles",
                    "A decision-maker's guide to where Python fits in a modern enterprise stack — "
                    "and where it doesn't.",
                    "<h2>Beyond the hype</h2><p>Python's strength isn't raw speed — it's developer "
                    "velocity, a vast ecosystem, and unmatched reach into data and AI workloads.</p>"
                    "<h2>Where it fits</h2><ul><li>Data pipelines and analytics</li><li>Machine learning "
                    "and AI services</li><li>Rapid API development with FastAPI or Django</li></ul>",
                    ["python", "enterprise", "backend", "ai"],
                    False,
                ),
                (
                    "Revamping a SaaS Website: A Content-First Approach",
                    "Case Studies",
                    "How leading with content — not design — produced a website revamp that both "
                    "users and search engines loved.",
                    "<h2>Content before pixels</h2><p>When I took ownership of the website revamp, I "
                    "started with messaging and information architecture rather than visuals.</p>"
                    "<h2>The process</h2><ul><li>Audited every existing page for intent and performance</li>"
                    "<li>Rewrote core pages around buyer and developer journeys</li><li>Aligned design "
                    "to the content, not the other way round</li></ul><h2>Outcome</h2><p>A clearer, "
                    "faster-ranking site that reflected the company's real engineering depth.</p>",
                    ["website-revamp", "saas", "content-strategy", "ux-writing"],
                    False,
                ),
            ]
            for i, (title, cat, desc, content, tags, featured) in enumerate(works):
                db.add(
                    Work(
                        title=title,
                        slug=slugify(title),
                        description=desc,
                        content=content,
                        tags=",".join(tags),
                        is_featured=featured,
                        order=i,
                        category_id=cats[cat].id,
                        published_date=date(2025, 1 + i, 14),
                    )
                )

        # ── Experience ──
        if db.query(Experience).count() == 0:
            exp = [
                (
                    "Cubet",
                    "Technical Content Writer",
                    "Cubet's first in-house technical writer. Built the content function from scratch — "
                    "delivering SEO/AEO-optimised content that brought 100+ transactional keywords into "
                    "SERP ranking, and taking full ownership of the company website revamp.",
                    "2022",
                    "Present",
                ),
                (
                    "Freelance",
                    "Content Writer",
                    "Wrote web and marketing content for technology and engineering clients, developing "
                    "the research-driven, search-aware approach I use today.",
                    "2020",
                    "2022",
                ),
            ]
            for i, (company, role, desc, start, end) in enumerate(exp):
                db.add(
                    Experience(
                        company=company,
                        role=role,
                        description=desc,
                        start_date=start,
                        end_date=end,
                        order=i,
                    )
                )

        # ── Testimonials ──
        if db.query(Testimonial).count() == 0:
            ts = [
                (
                    "Kiran R",
                    "Cubet",
                    "Engineering Leader",
                    "Arya was our first in-house Technical Writer, and she set the benchmark extremely "
                    "high. Give her a topic and she'll dig into the details, understand the subject "
                    "thoroughly, and turn it into clear, structured, impactful content. Her SEO/AEO work "
                    "brought 100+ transactional keywords into SERP ranking. When I moved on, she stepped "
                    "up and took full ownership of the website revamp — and executed it successfully. "
                    "Dependable, proactive, and always ready for a new challenge. Any team would be "
                    "fortunate to have her.",
                ),
            ]
            for i, (name, company, role, msg) in enumerate(ts):
                db.add(
                    Testimonial(
                        client_name=name,
                        company=company,
                        role=role,
                        message=msg,
                        order=i,
                    )
                )

        # ── Social links ──
        if db.query(SocialLink).count() == 0:
            socials = [
                ("LinkedIn", "https://www.linkedin.com/in/arya-suresh", "linkedin"),
                ("Email", "mailto:arya.suresh@example.com", "mail"),
                ("Medium", "https://medium.com", "medium"),
            ]
            for i, (platform, url, icon) in enumerate(socials):
                db.add(SocialLink(platform=platform, url=url, icon=icon, order=i))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
