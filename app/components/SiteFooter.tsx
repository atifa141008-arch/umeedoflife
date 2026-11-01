import Image from "next/image";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Our Impact", href: "/impact" },
  { label: "Careers", href: "/careers" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#dfe7e2] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <a href="/" className="inline-flex items-center">
              <Image
                src="/images/umeed-logo.png"
                alt="Umeed of Life"
                width={360}
                height={240}
                className="h-auto w-[155px] object-contain sm:w-[180px]"
              />
            </a>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#687870]">
              Building hope, empowering lives and creating opportunities
              through commerce, innovation, community support and global
              connections.
            </p>
          </div>

          <div>
            <h2 className="font-black text-[#173f32]">
              Explore Umeed
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3"
            >
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#687870] transition hover:text-[#173f32]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href="/management/login"
              className="mt-5 inline-block text-sm font-bold text-[#173f32] hover:text-[#b7792b]"
            >
              Central Management Login →
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#e5ebe7] pt-6 text-xs text-[#87948d] sm:flex-row">
          <p>© 2026 Umeed of Life. All rights reserved.</p>
          <p>Hope • Opportunity • Progress</p>
        </div>
      </div>
    </footer>
  );
}