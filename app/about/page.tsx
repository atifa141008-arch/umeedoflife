import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
     <SiteHeader />
      <section className="border-b border-[#dfe8e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b7792b]">
              About Umeed of Life
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] text-[#173f32] sm:text-6xl">
              Building a better tomorrow, together.
            </h1>

            <p className="mt-7 text-lg leading-8 text-[#687870]">
              Umeed of Life is being built as a connected ecosystem that
              brings commerce, opportunities, welfare and international
              connections together under one vision.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Our Vision",
              text: "To create a trusted ecosystem where people and businesses can grow together.",
            },
            {
              title: "Our Mission",
              text: "To build practical opportunities through commerce, employment, welfare and global services.",
            },
            {
              title: "Our Values",
              text: "Trust, transparency, responsibility, empowerment and continuous improvement.",
            },
            {
              title: "Our Future",
              text: "To grow from a local platform into a connected ecosystem serving people across borders.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#dfe8e2] bg-white p-7 shadow-sm"
            >
              <div className="mb-6 h-10 w-10 rounded-xl bg-[#173f32]" />

              <h2 className="text-xl font-bold text-[#173f32]">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#687870]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}