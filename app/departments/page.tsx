import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const departments = [
  {
    name: "Umeed Marketplace",
    category: "Multi-Vendor Commerce",
    description:
      "A trusted marketplace where multiple sellers can build their stores, list products and reach customers through one connected platform.",
    status: "Live",
    accent: "#725596",
    bg: "#f5effa",
    href: "/marketplace",
  },
  {
    name: "Umeed Essentials",
    category: "Umeed-Owned Products",
    description:
      "Quality products produced and managed through Umeed of Life, available for direct customers and future dropshipping partners.",
    status: "Live",
    accent: "#b85d6c",
    bg: "#fff1f3",
    href: "/departments/essentials",
  },
  {
    name: "Umeed Care Foundation",
    category: "Welfare & Community",
    description:
      "A future platform for donations, assistance requests, welfare projects and transparent community impact.",
    status: "Coming Soon",
    accent: "#3f805d",
    bg: "#eef8f1",
    href: "#",
  },
  {
    name: "Umeed WorkHub",
    category: "Jobs, Skills & Internships",
    description:
      "A future professional platform connecting talented people with jobs, internships, companies and opportunities.",
    status: "Coming Soon",
    accent: "#725596",
    bg: "#f5effa",
    href: "#",
  },
  {
    name: "Umeed Global",
    category: "International Commerce & Services",
    description:
      "A future global platform for international products, digital services and cargo solutions connecting Pakistan with the world.",
    status: "Coming Soon",
    accent: "#3e7897",
    bg: "#eef7fb",
    href: "#",
  },
];

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      {/* Header */}
      <SiteHeader />
      <section className="border-b border-[#dfe8e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              Umeed Ecosystem
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] text-[#173f32] sm:text-6xl">
              Our Departments
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#687870]">
              Different services, one mission. Explore the departments that
              make up the growing Umeed of Life ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {departments.map((department, index) => {
            const isLive = department.status === "Live";

            return (
              <article
                key={department.name}
                className={`group overflow-hidden rounded-[30px] border border-[#dfe8e2] bg-white shadow-sm transition duration-300 ${
                  isLive
                    ? "hover:-translate-y-2 hover:shadow-xl"
                    : "opacity-95"
                } ${index === 4 ? "lg:col-span-2" : ""}`}
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: department.accent }}
                />

                <div
                  className={`grid gap-8 p-7 sm:p-9 ${
                    index === 4
                      ? "md:grid-cols-[0.9fr_1.1fr] md:items-center"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
                        style={{ backgroundColor: department.accent }}
                      >
                        U
                      </div>

                      <span
                        className="rounded-full px-3 py-1.5 text-[11px] font-bold"
                        style={{
                          backgroundColor: isLive
                            ? "#edf7f0"
                            : "#f1f3f2",
                          color: isLive ? "#34704f" : "#7b8580",
                        }}
                      >
                        {department.status}
                      </span>
                    </div>

                    <p
                      className="mt-7 text-xs font-bold uppercase tracking-[0.18em]"
                      style={{ color: department.accent }}
                    >
                      {department.category}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#173f32]">
                      {department.name}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm leading-7 text-[#687870]">
                      {department.description}
                    </p>

                    {isLive ? (
                      <a
                        href={department.href}
                        className="mt-7 inline-flex rounded-full bg-[#173f32] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#235746]"
                      >
                        Explore Department →
                      </a>
                    ) : (
                      <div className="mt-7 inline-flex rounded-full bg-[#f2f4f3] px-6 py-3 text-sm font-semibold text-[#7b8580]">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Future */}
      <section className="border-y border-[#dfe8e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
            Growing Together
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[#173f32] sm:text-4xl">
            More opportunities are coming to the Umeed ecosystem.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#687870]">
            Marketplace and Essentials are our initial operational departments.
            Care, WorkHub and Global are being prepared for future launches.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}