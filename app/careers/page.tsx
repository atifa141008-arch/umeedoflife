import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
const openings = [
  {
    title: "Marketplace Operations",
    department: "Umeed Marketplace",
    type: "Future Opening",
    description:
      "Help manage sellers, products, orders, settlements and customer experience across the Umeed Marketplace.",
  },
  {
    title: "E-Commerce & Warehouse Operations",
    department: "Umeed Essentials",
    type: "Future Opening",
    description:
      "Support product operations, inventory, warehouse coordination, fulfillment and customer orders.",
  },
  {
    title: "Marketing & Growth",
    department: "Central Management",
    type: "Future Opening",
    description:
      "Build the Umeed brand through marketing campaigns, digital growth, partnerships and communication.",
  },
  {
    title: "Technology & Product",
    department: "Central Management",
    type: "Future Opening",
    description:
      "Help build secure, scalable and modern technology systems for the complete Umeed ecosystem.",
  },
];

const benefits = [
  "Meaningful work with real-world impact",
  "Opportunities to learn and grow",
  "Professional and collaborative environment",
  "Future leadership opportunities",
  "Work across multiple Umeed departments",
  "Build something designed for long-term impact",
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#173f32]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b7792b]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#235746]/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f2d6a4]">
            CAREERS AT UMEED
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Build your career.
            <span className="block text-[#d6a65d]">
              Build a better future.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Join Umeed of Life and become part of a growing ecosystem focused
            on opportunity, commerce, technology, welfare and meaningful
            impact.
          </p>

          <a
            href="#openings"
            className="mt-9 inline-flex rounded-full bg-[#b7792b] px-7 py-4 font-bold text-white transition hover:bg-[#9c641f]"
          >
            Explore Opportunities
          </a>
        </div>
      </section>

      {/* Why Umeed */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b7792b]">
            Why Umeed
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f32] md:text-4xl">
            More than a job. A chance to build something meaningful.
          </h2>

          <p className="mt-5 leading-8 text-[#687870]">
            Umeed is being built as a long-term ecosystem. Our teams will work
            across commerce, technology, employment, welfare and international
            opportunities.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="rounded-3xl border border-[#e3ebe6] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173f32] text-sm font-black text-white">
                {String(index + 1).padStart(2, "0")}
              </div>

              <p className="mt-5 font-bold text-[#263a31]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b7792b]">
                Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f32] md:text-4xl">
                Current & future opportunities
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-[#687870]">
                As Umeed grows, available positions will be published here.
                Applications will eventually be managed through the Umeed
                WorkHub system.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f5f8f6] px-5 py-3 text-sm font-bold text-[#52635b]">
              Recruitment system coming soon
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {openings.map((opening) => (
              <article
                key={opening.title}
                className="rounded-3xl border border-[#e3ebe6] bg-[#f9fbfa] p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-[#173f32]/10 px-3 py-1 text-xs font-bold text-[#173f32]">
                    {opening.department}
                  </span>

                  <span className="rounded-full bg-[#b7792b]/10 px-3 py-1 text-xs font-bold text-[#9a621f]">
                    {opening.type}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black text-[#173f32]">
                  {opening.title}
                </h3>

                <p className="mt-4 leading-7 text-[#687870]">
                  {opening.description}
                </p>

                <button
                  disabled
                  className="mt-7 cursor-not-allowed rounded-full border border-[#dce5df] bg-white px-5 py-3 text-sm font-bold text-[#93a19a]"
                >
                  Applications Opening Soon
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Future WorkHub */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-[#235746] p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d6a65d]">
                Umeed WorkHub
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black text-white md:text-4xl">
                A dedicated platform for jobs, internships and opportunities.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-white/70">
                WorkHub will bring together employment opportunities,
                internships, talent discovery and career development in one
                dedicated Umeed department.
              </p>
            </div>

            <a
              href="/departments"
              className="inline-flex rounded-full bg-white px-6 py-4 text-sm font-bold text-[#173f32] transition hover:bg-[#f2f5f3]"
            >
              View Departments
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e5ebe7] bg-[#f8faf8]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-black text-[#173f32] md:text-4xl">
            Want to grow with Umeed?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#687870]">
            Keep an eye on this page as our teams and opportunities continue
            to grow.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#173f32] px-7 py-4 font-bold text-white transition hover:bg-[#235746]"
          >
            Contact Umeed
          </a>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}