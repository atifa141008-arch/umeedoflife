import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const impactStats = [
  {
    number: "0",
    label: "Lives Impacted",
    description: "People and communities reached through Umeed initiatives.",
  },
  {
    number: "0",
    label: "Projects Completed",
    description: "Projects and initiatives successfully delivered.",
  },
  {
    number: "0",
    label: "People Supported",
    description: "People receiving support through our ecosystem.",
  },
  {
    number: "0",
    label: "Active Partners",
    description: "Businesses and organizations working with Umeed.",
  },
];

const impactAreas = [
  {
    title: "Community Support",
    text: "Supporting people and communities through meaningful initiatives and future welfare programs.",
    icon: "01",
  },
  {
    title: "Economic Opportunity",
    text: "Creating opportunities through commerce, entrepreneurship, employment and digital services.",
    icon: "02",
  },
  {
    title: "Skills & Careers",
    text: "Building pathways for people to develop skills, gain experience and find professional opportunities.",
    icon: "03",
  },
  {
    title: "Global Connections",
    text: "Connecting businesses, services and people across borders through the Umeed Global ecosystem.",
    icon: "04",
  },
];

const projects = [
  {
    title: "Umeed Community Initiatives",
    category: "Community",
    status: "Building",
    text: "Future initiatives designed to support communities and create measurable positive impact.",
  },
  {
    title: "Umeed Opportunity Network",
    category: "Opportunity",
    status: "Preparing",
    text: "A growing ecosystem designed to connect people with products, businesses and opportunities.",
  },
  {
    title: "Umeed Global Vision",
    category: "Global",
    status: "Coming Soon",
    text: "Our future international ecosystem connecting services, products and cargo solutions.",
  },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      <SiteHeader />
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#173f32]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d5a66b]">
              Our Impact
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl">
              Measuring the difference we make.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#c9d8d1]">
              Umeed of Life is being built with transparency and measurable
              impact at its core. As our ecosystem grows, this page will
              provide a clear picture of the work being done.
            </p>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-[#dfe8e2] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl font-bold tracking-tight text-[#173f32]">
                {stat.number}
              </div>

              <h2 className="mt-3 font-bold text-[#173f32]">
                {stat.label}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#687870]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT AREAS */}
      <section className="border-y border-[#dfe8e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              Where We Create Impact
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173f32] sm:text-5xl">
              Impact across multiple areas.
            </h2>

            <p className="mt-5 leading-7 text-[#687870]">
              Umeed is designed to create value not through one activity, but
              through a connected ecosystem of opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {impactAreas.map((area) => (
              <article
                key={area.title}
                className="group rounded-[28px] border border-[#dfe8e2] bg-[#f8faf8] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#173f32] text-xs font-bold text-white">
                    {area.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#173f32]">
                      {area.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#687870]">
                      {area.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              Our Work
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173f32] sm:text-5xl">
              Projects & initiatives.
            </h2>

            <p className="mt-5 leading-7 text-[#687870]">
              Completed projects will eventually appear here with verified
              information, progress, dates and impact details.
            </p>
          </div>

          <div className="rounded-full bg-[#eef5f0] px-4 py-2 text-xs font-semibold text-[#34704f]">
            Transparent Impact Reporting
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-[28px] border border-[#dfe8e2] bg-white shadow-sm"
            >
              <div className="h-2 bg-[#b7792b]" />

              <div className="p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#b7792b]">
                    {project.category}
                  </span>

                  <span className="rounded-full bg-[#f1f4f2] px-3 py-1 text-[10px] font-bold text-[#7a8580]">
                    {project.status}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#173f32]">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#687870]">
                  {project.text}
                </p>

                <button className="mt-6 text-sm font-semibold text-[#173f32]">
                  View Details →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="bg-[#173f32]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d5a66b]">
                Transparency
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Every meaningful action should be measurable.
              </h2>

              <p className="mt-6 max-w-2xl leading-8 text-[#c9d8d1]">
                Future welfare and community projects will include verified
                records so visitors can understand what was done, when it was
                done and what impact it created.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-7">
              <div className="space-y-5">
                {[
                  "Verified project information",
                  "Progress and completion records",
                  "Impact statistics",
                  "Responsible reporting",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b7792b] text-sm font-bold text-white">
                      ✓
                    </div>

                    <span className="text-sm font-medium text-[#d8e4de]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}