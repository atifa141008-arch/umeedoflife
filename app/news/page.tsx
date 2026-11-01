import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const newsItems = [
  {
    category: "Company Update",
    date: "Coming Soon",
    title: "The Beginning of Umeed of Life",
    description:
      "Discover our vision of building an ecosystem that brings commerce, opportunities, welfare and global connections together.",
    status: "Upcoming",
    number: "01",
  },
  {
    category: "E-Commerce",
    date: "Coming Soon",
    title: "Umeed Marketplace",
    description:
      "Our marketplace aims to connect sellers and customers through a unified shopping experience with centralized order and payment management.",
    status: "Upcoming",
    number: "02",
  },
  {
    category: "Our Products",
    date: "Coming Soon",
    title: "Introducing Umeed Essentials",
    description:
      "Explore our planned product business, designed to bring Umeed-managed products and eligible dropshipping opportunities into one platform.",
    status: "Upcoming",
    number: "03",
  },
  {
    category: "Future Expansion",
    date: "Coming Soon",
    title: "Expanding the Umeed Ecosystem",
    description:
      "Future plans include career opportunities, welfare initiatives and international services as these departments become operational.",
    status: "Planned",
    number: "04",
  },
];

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#173f32]">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#b7792b]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-[#e8c68e]">
            NEWS & ANNOUNCEMENTS
          </span>

          <h1 className="mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Every step forward
            <span className="block text-[#d6a65d]">
              begins with a vision.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Follow Umeed of Life for official announcements, platform
            updates, department launches and future developments.
          </p>

          <a
            href="#latest-news"
            className="mt-9 inline-flex rounded-full bg-[#b7792b] px-7 py-4 font-bold text-white transition hover:bg-[#9c641f]"
          >
            Explore Updates
          </a>
        </div>
      </section>

      {/* News list */}
      <section
        id="latest-news"
        className="mx-auto max-w-7xl px-6 py-20 md:py-24"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b7792b]">
              Stay Informed
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#173f32] md:text-4xl">
              Latest News & Updates
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-[#687870]">
              This page will become the official source for verified Umeed
              announcements. New updates can be added as the company grows.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#173f32]/10 px-4 py-2 text-sm font-bold text-[#173f32]">
            Official Updates
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {newsItems.map((item) => (
            <article
              key={item.number}
              className="group rounded-3xl border border-[#e3ebe6] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#173f32]/10 px-3 py-2 text-xs font-bold text-[#173f32]">
                  {item.category}
                </span>

                <span className="text-sm font-medium text-[#87948d]">
                  {item.date}
                </span>
              </div>

              <div className="mt-7 flex items-start justify-between gap-4">
                <h3 className="text-2xl font-black leading-snug text-[#173f32]">
                  {item.title}
                </h3>

                <span className="text-3xl font-black text-[#b7792b]/30">
                  {item.number}
                </span>
              </div>

              <p className="mt-4 leading-8 text-[#687870]">
                {item.description}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-[#edf1ee] pt-5">
                <span className="text-sm font-bold text-[#9a6b2e]">
                  {item.status}
                </span>

                <span className="text-xl text-[#173f32] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-dashed border-[#cbd8d0] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f32]/10 text-2xl text-[#173f32]">
            +
          </div>

          <h3 className="mt-5 text-xl font-black text-[#173f32]">
            More updates are on the way
          </h3>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-[#687870]">
            Future announcements should be published through the authorized
            management dashboard, so the public sees approved information.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#edf3ef]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <h2 className="text-3xl font-black text-[#173f32] md:text-4xl">
            Want to know more about Umeed?
          </h2>

          <p className="mt-4 leading-8 text-[#687870]">
            Explore our departments, learn about our mission or contact
            our team for official information.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/departments"
              className="rounded-full bg-[#173f32] px-6 py-4 font-bold text-white transition hover:bg-[#235746]"
            >
              Explore Departments
            </a>

            <a
              href="/contact"
              className="rounded-full border border-[#173f32]/20 bg-white px-6 py-4 font-bold text-[#173f32] transition hover:bg-[#f8faf8]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#dfe7e2] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-[#687870] md:flex-row">
          <p>© 2026 Umeed of Life. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <a href="/about">About</a>
            <a href="/departments">Departments</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}