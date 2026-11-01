import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const departments = [
  {
    name: "Umeed Marketplace",
    description:
      "A trusted multi-vendor marketplace where businesses and customers connect, discover and grow together.",
    status: "Explore",
    className: "marketplace",
  },
  {
    name: "Umeed Essentials",
    description:
      "Quality products created and supplied through Umeed of Life for customers and entrepreneurs.",
    status: "Explore",
    className: "essentials",
  },
  {
    name: "Umeed Care",
    description:
      "Creating hope through welfare, assistance, donations and meaningful community support.",
    status: "Coming Soon",
    className: "care",
  },
  {
    name: "Umeed WorkHub",
    description:
      "Connecting talented people with internships, careers, companies and opportunities.",
    status: "Coming Soon",
    className: "workhub",
  },
  {
    name: "Umeed Global",
    description:
      "Connecting Pakistan with the world through digital services, products and cargo solutions.",
    status: "Coming Soon",
    className: "global",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      {/* NAVBAR */}
      <SiteHeader />

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dceee4] blur-3xl" />
        <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-[#f2e4d0] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d5e3db] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#557267] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#b7792b]" />
              Building Hope • Empowering Lives
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#173f32] sm:text-6xl lg:text-7xl">
              Building Hope.
              <br />
              <span className="text-[#b7792b]">Creating</span> a Better
              Tomorrow.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#607069] sm:text-lg">
              Umeed of Life is building an ecosystem where commerce,
              opportunities, welfare and global connections work together to
              create meaningful change.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#departments"
                className="rounded-full bg-[#173f32] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#173f32]/10 transition hover:-translate-y-1 hover:bg-[#235746]"
              >
                Explore Departments
              </a>

              <a
                href="#impact"
                className="rounded-full border border-[#cbdad2] bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#173f32] transition hover:-translate-y-1 hover:border-[#b7792b]"
              >
                Our Impact
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#687870]">
              <span>✓ Transparent</span>
              <span>✓ People-focused</span>
              <span>✓ Built for growth</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[40px] bg-[#dceee4]/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white bg-[#173f32] p-3 shadow-2xl">
              <div className="relative min-h-[470px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2d6754] via-[#173f32] to-[#0e2b23] p-7">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
                <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10" />

                <div className="relative flex h-full min-h-[416px] flex-col justify-between">
                  <div>
                    <div className="text-5xl font-black uppercase leading-none tracking-[0.02em] text-[#D4AF37] sm:text-6xl">
  UMEED
</div>

<div className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
  OF LIFE
</div>

                    <div className="mt-5 h-px w-20 bg-[#c28b48]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <div className="text-3xl font-bold text-white">05</div>
                      <div className="mt-1 text-xs text-[#cbded4]">
                        Ecosystem Departments
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <div className="text-3xl font-bold text-white">01</div>
                      <div className="mt-1 text-xs text-[#cbded4]">
                        Shared Vision
                      </div>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-[#c28b48]/30 bg-[#c28b48]/10 p-5">
                      <div className="text-sm font-semibold text-[#f2d4aa]">
                        One ecosystem. Many possibilities.
                      </div>
                      <div className="mt-1 text-xs leading-6 text-[#d1ddd7]">
                        Commerce, careers, welfare and global opportunities
                        connected under one vision.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-y border-[#e2ebe5] bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              About Umeed
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173f32] sm:text-5xl">
              One vision.
              <br />
              Multiple ways to make an impact.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-[#607069]">
              Umeed of Life is designed as a connected ecosystem. From
              products and marketplaces to employment, welfare and international
              services, every department has a distinct purpose while sharing
              the same mission.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Trust", "Building reliable relationships with people and businesses."],
                ["Opportunity", "Creating pathways for people to learn, work and grow."],
                ["Transparency", "Keeping our operations accountable and clear."],
                ["Growth", "Building a platform designed to evolve with its community."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#e1e9e4] bg-[#f8faf8] p-5"
                >
                  <h3 className="font-bold text-[#173f32]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#697970]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="departments" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
            Our Ecosystem
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173f32] sm:text-5xl">
            Departments built around real needs.
          </h2>

          <p className="mt-5 leading-7 text-[#687870]">
            Explore the growing Umeed ecosystem. Some departments are already
            preparing for launch while others are coming soon.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <article
              key={department.name}
              className={`group relative overflow-hidden rounded-3xl border border-[#e0e8e3] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                department.className === "marketplace"
                  ? "hover:border-[#c58b48]"
                  : department.className === "essentials"
                    ? "hover:border-[#c56b75]"
                    : department.className === "care"
                      ? "hover:border-[#4b8b68]"
                      : department.className === "workhub"
                        ? "hover:border-[#8064a8]"
                        : "hover:border-[#4d83a0]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white ${
                    department.className === "marketplace"
                      ? "bg-[#b7792b]"
                      : department.className === "essentials"
                        ? "bg-[#b85d6c]"
                        : department.className === "care"
                          ? "bg-[#3f805d]"
                          : department.className === "workhub"
                            ? "bg-[#725596]"
                            : "bg-[#3e7897]"
                  }`}
                >
                  U
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    department.status === "Coming Soon"
                      ? "bg-[#f1f3f2] text-[#77847e]"
                      : "bg-[#eef6f1] text-[#34704f]"
                  }`}
                >
                  {department.status}
                </span>
              </div>

              <h3 className="mt-7 text-2xl font-bold tracking-tight text-[#173f32]">
                {department.name}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-7 text-[#687870]">
                {department.description}
              </p>

              {department.status === "Explore" ? (
                <button className="mt-6 font-semibold text-[#173f32] transition group-hover:text-[#b7792b]">
                  Explore Department →
                </button>
              ) : (
                <div className="mt-6 text-sm font-semibold text-[#8a9690]">
                  Launching in the future
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d5a66b]">
              Our Impact
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Growing with purpose.
            </h2>

            <p className="mt-5 leading-7 text-[#c6d5ce]">
              These figures will eventually be connected to the central
              management system so the organization can maintain accurate,
              transparent and up-to-date impact information.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["0", "Lives Impacted"],
              ["0", "Projects Completed"],
              ["0", "Active Partners"],
              ["0", "Communities Reached"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <div className="text-4xl font-bold text-white">{number}</div>
                <div className="mt-2 text-sm text-[#c6d5ce]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className="bg-[#f3f7f4]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              Careers
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173f32] sm:text-5xl">
              Grow with Umeed.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#687870]">
              As Umeed grows, new opportunities will become available across
              our departments. Our WorkHub will eventually bring jobs,
              internships and professional opportunities together.
            </p>

            <button className="mt-8 rounded-full bg-[#173f32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#235746]">
              Explore Opportunities
            </button>
          </div>

          <div className="rounded-3xl border border-[#dce7df] bg-white p-8 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-widest text-[#8a9690]">
              Coming Soon
            </div>

            <div className="mt-3 text-2xl font-bold text-[#173f32]">
              Umeed WorkHub
            </div>

            <p className="mt-3 text-sm leading-7 text-[#687870]">
              Jobs, internships, skills and professional opportunities under
              one platform.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="rounded-[32px] bg-[#173f32] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d5a66b]">
                Contact Umeed
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Let&apos;s build something meaningful together.
              </h2>

              <p className="mt-4 leading-7 text-[#c6d5ce]">
                For partnerships, business opportunities, investment
                discussions or general inquiries, connect with the Umeed team.
              </p>
            </div>

            <button className="mt-8 shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#173f32] transition hover:-translate-y-1 lg:mt-0">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}