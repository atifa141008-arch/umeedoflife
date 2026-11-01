"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MarketplaceHeader from "./components/MarketplaceHeader";

type IconName =
  | "fashion"
  | "electronics"
  | "home"
  | "beauty"
  | "bags"
  | "sports"
  | "kids"
  | "books"
  | "search"
  | "cart"
  | "arrow"
  | "shield"
  | "truck"
  | "store"
  | "heart"
  | "package";

type MarketplaceProduct = {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  hover_image_url?: string | null;
  vendor_name?: string | null;
  vendor_verified?: boolean;
  rating?: number | null;
  review_count?: number | null;
  stock_quantity?: number | null;
  created_at?: string | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  category?: string | null;
};

type MarketplaceStore = {
  id: string;
  name: string;
  logo_url?: string | null;
  rating?: number | null;
  is_verified?: boolean;
  slug?: string | null;
};

type Category = {
  name: string;
  description: string;
  icon: IconName;
};

const categories: Category[] = [
  {
    name: "Fashion",
    description: "Clothing and accessories",
    icon: "fashion",
  },
  {
    name: "Electronics",
    description: "Mobiles and gadgets",
    icon: "electronics",
  },
  {
    name: "Home & Living",
    description: "Furniture and home decor",
    icon: "home",
  },
  {
    name: "Beauty & Health",
    description: "Beauty and personal care",
    icon: "beauty",
  },
  {
    name: "Bags & Luggage",
    description: "Bags, wallets and travel",
    icon: "bags",
  },
  {
    name: "Sports & Outdoors",
    description: "Fitness and outdoor gear",
    icon: "sports",
  },
  {
    name: "Baby & Kids",
    description: "Products for little ones",
    icon: "kids",
  },
  {
    name: "Books & Stationery",
    description: "Books and learning",
    icon: "books",
  },
];

function MarketplaceIcon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "fashion":
      return (
        <svg {...common}>
          <path d="m8 4-5 3 3 5 3-2v10h10V10l3 2 3-5-5-3-3 3h-6L8 4Z" />
        </svg>
      );

    case "electronics":
      return (
        <svg {...common}>
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
          <path d="M10 5h4M11 18.5h2" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v12h14V9M9 21v-7h6v7" />
        </svg>
      );

    case "beauty":
      return (
        <svg {...common}>
          <path d="M9 3h6M10 3v5l-4 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8l-4-4V3" />
          <path d="M7 13h10M10 17h4" />
        </svg>
      );

    case "bags":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M8 7V5a4 4 0 0 1 8 0v2M3 12h18" />
        </svg>
      );

    case "sports":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m7 5 4 3-1 5-5 2M17 5l-4 3 1 5 5 2M10 13l2 3 2-3" />
        </svg>
      );

    case "kids":
      return (
        <svg {...common}>
          <path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z" />
          <path d="M9 11h.01M15 11h.01M10 15c1.2 1 2.8 1 4 0" />
        </svg>
      );

    case "books":
      return (
        <svg {...common}>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z" />
          <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 6h7M8 9h7" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
      );

    case "cart":
      return (
        <svg {...common}>
          <path d="M3 3h2l2.2 11a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M4 12h16M13 5l7 7-7 7" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v12H3zM14 10h4l3 4v4h-7" />
          <circle cx="7.5" cy="19" r="1.5" />
          <circle cx="17.5" cy="19" r="1.5" />
        </svg>
      );

    case "store":
      return (
        <svg {...common}>
          <path d="M3 10h18l-2-7H5l-2 7Z" />
          <path d="M5 10v11h14V10M9 21v-7h6v7" />
          <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        </svg>
      );

    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      );

    case "package":
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
        </svg>
      );
  }
}

const benefits = [
  {
    icon: "shield" as const,
    title: "Seller verification",
    description:
      "Our marketplace is designed to support a verification process before sellers can start selling.",
  },
  {
    icon: "truck" as const,
    title: "Delivery options",
    description:
      "Discover available delivery options as services are configured for the marketplace.",
  },
  {
    icon: "package" as const,
    title: "One shopping destination",
    description:
      "Explore different product categories through one connected shopping experience.",
  },
  {
    icon: "heart" as const,
    title: "Supporting businesses",
    description:
      "A shared platform designed to connect customers with independent businesses.",
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [stores, setStores] = useState<MarketplaceStore[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [catalogueError, setCatalogueError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [saleSeconds, setSaleSeconds] = useState(6 * 60 * 60 + 24 * 60 + 15);
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadCatalogue() {
      setCatalogueLoading(true);
      try {
        // Expected response: { products: [...], stores: [...] }.
        // If your API uses a different shape, adapt this mapping to that response.
        const response = await fetch("/api/marketplace/catalogue", { cache: "no-store" });
        if (!response.ok) throw new Error("Catalogue endpoint is not available");
        const data = await response.json();
        if (cancelled) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
        setStores(Array.isArray(data.stores) ? data.stores : []);
        setCatalogueError(false);
      } catch {
        if (!cancelled) setCatalogueError(true);
      } finally {
        if (!cancelled) setCatalogueLoading(false);
      }
    }
    loadCatalogue();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(window.localStorage.getItem("umeed-marketplace-cart") || "[]") as Array<{ productId: string; quantity: number }>;
      setCartCount(storedCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0));
      const storedWishlist = JSON.parse(window.localStorage.getItem("umeed-marketplace-wishlist") || "[]");
      if (Array.isArray(storedWishlist)) setWishlist(storedWishlist.filter((id): id is string => typeof id === "string"));
    } catch { /* Ignore invalid local browser data and start with an empty cart. */ }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSaleSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % 3);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.is_featured).slice(0, 8),
    [products],
  );
  const newArrivals = useMemo(
    () => [...products].filter((product) => product.is_new_arrival)
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")).slice(0, 8),
    [products],
  );
  const bestSellers = useMemo(
    () => products.filter((product) => product.is_best_seller).slice(0, 8),
    [products],
  );
  const saleProducts = useMemo(
    () => products.filter((product) => product.compare_at_price && product.compare_at_price > product.price).slice(0, 4),
    [products],
  );

  function addToCart(product: MarketplaceProduct) {
    // This UI event is ready; persistent cart storage/API should be connected before checkout goes live.
    try {
      const current = JSON.parse(window.localStorage.getItem("umeed-marketplace-cart") || "[]") as Array<{ productId: string; quantity: number }>;
      const existing = current.find((item) => item.productId === product.id);
      if (existing) existing.quantity += 1;
      else current.push({ productId: product.id, quantity: 1 });
      window.localStorage.setItem("umeed-marketplace-cart", JSON.stringify(current));
      setCartCount(current.reduce((sum, item) => sum + item.quantity, 0));
      setCartNotice(`${product.name} added to cart`);
      window.setTimeout(() => setCartNotice(""), 2200);
    } catch {
      setCartNotice("Could not update cart. Please try again.");
    }
  }

  function toggleWishlist(productId: string) {
    setWishlist((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      try { window.localStorage.setItem("umeed-marketplace-wishlist", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);
  }

  function ProductCard({ product }: { product: MarketplaceProduct }) {
    const discount = product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : 0;
    return (
      <article key={product.id} className="marketplace-product-card group overflow-hidden rounded-2xl border border-[#f0e3dc] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/4.2] overflow-hidden bg-[#fff5ef]">
          {product.image_url ? (
            <>
              {/* Native lazy loading avoids requiring remote image domains in next.config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image_url} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              {product.hover_image_url && <img src={product.hover_image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" />}
            </>
          ) : <div className="flex h-full items-center justify-center text-sm text-[#a08c81]">Image coming soon</div>}
          {discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-[#df604b] px-2.5 py-1 text-xs font-extrabold text-white">-{discount}%</span>}
          {product.stock_quantity != null && product.stock_quantity > 0 && product.stock_quantity <= 3 && <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#bd5945] shadow">Only {product.stock_quantity} left</span>}
          {product.stock_quantity === 0 && <span className="absolute bottom-3 left-3 rounded-full bg-[#302b29]/90 px-2.5 py-1 text-[11px] font-bold text-white">Out of stock</span>}
          <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow transition hover:scale-105 ${wishlist.includes(product.id) ? "bg-[#df604b] text-white" : "bg-white/95 text-[#bd5945]"}`}><MarketplaceIcon name="heart" className="h-4 w-4" /></button>
        </div>
        <div className="p-4">
          <p className="truncate text-[11px] text-[#92847d]">{product.vendor_name || "Marketplace seller"}{product.vendor_verified ? " · ✓ Verified Seller" : ""}</p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-[#39312e]">{product.name}</h3>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#9b6b22]">★ <span className="font-bold">{typeof product.rating === "number" ? product.rating.toFixed(1) : "—"}</span><span className="text-[#a08c81]">({product.review_count ?? 0})</span></div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2"><span className="text-base font-extrabold text-[#bd5945]">{formatPrice(product.price)}</span>{discount > 0 && <span className="text-xs text-[#a08c81] line-through">{formatPrice(product.compare_at_price!)}</span>}</div>
          <button type="button" disabled={product.stock_quantity === 0} onClick={() => addToCart(product)} className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#df604b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#c94b38] disabled:cursor-not-allowed disabled:bg-[#c8bbb4]"><MarketplaceIcon name="cart" className="h-4 w-4" />{product.stock_quantity === 0 ? "Out of stock" : "Add to Cart"}</button>
        </div>
      </article>
    );
  }

  function ProductRow({ title, eyebrow, items }: { title: string; eyebrow: string; items: MarketplaceProduct[] }) {
    return <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c76a53]">{eyebrow}</p><h2 className="mt-2 text-2xl font-black text-[#302b29] sm:text-3xl">{title}</h2></div><a href="#marketplace-products" className="shrink-0 text-sm font-bold text-[#bd5945] hover:underline">View all →</a></div>
      {catalogueLoading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">{[0,1,2,3].map((n) => <div key={n} className="overflow-hidden rounded-2xl border border-[#f0e3dc] bg-white"><div className="marketplace-shimmer aspect-[4/4.2]"/><div className="space-y-3 p-4"><div className="marketplace-shimmer h-3 w-2/3 rounded"/><div className="marketplace-shimmer h-4 w-full rounded"/><div className="marketplace-shimmer h-8 w-full rounded-xl"/></div></div>)}</div>
      : items.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product}/>)}</div>
      : <div className="rounded-2xl border border-dashed border-[#e9c9bb] bg-white px-5 py-8 text-center text-sm text-[#82736c]">{catalogueError ? "Product catalogue is not connected yet. Connect the marketplace catalogue API to show real products." : "No products in this section yet. Published products will appear here automatically."}</div>}
    </section>;
  }

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query);

      const matchesSelected =
        !selectedCategory || category.name === selectedCategory;

      return matchesSearch && matchesSelected;
    });
  }, [search, selectedCategory]);

  function scrollToCategories() {
    document
      .getElementById("marketplace-categories")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    scrollToCategories();
  }

  return (
    <main className="marketplace-home min-h-screen overflow-x-clip bg-[#fffaf7] text-[#302b29]">
      <MarketplaceHeader />

      {/* HERO */}
      <section className="marketplace-hero relative isolate overflow-hidden border-b border-[#f3e3da]">
        <div className="marketplace-orb marketplace-orb-one" />
        <div className="marketplace-orb marketplace-orb-two" />

        <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div className="marketplace-reveal relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#efc9b8] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#bd634d] shadow-sm sm:text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#df604b]" />
              A marketplace by Umeed of Life
            </span>

            <h1 className="marketplace-title mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#302b29] sm:text-5xl lg:text-6xl xl:text-7xl">
              Discover more.
              <br />
              Shop with <span>Umeed.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#766760] sm:text-lg">
              Explore categories, discover new products and enjoy a connected
              shopping experience with Umeed Marketplace.
            </p>

            <form
              onSubmit={handleSearch}
              role="search"
              className="marketplace-search mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-[#eadbd3] bg-white p-2 shadow-lg shadow-[#9d654e]/5 transition duration-300 focus-within:border-[#df8069] focus-within:shadow-xl"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d95e48]">
                <MarketplaceIcon name="search" />
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedCategory("");
                }}
                placeholder="What are you looking for?"
                aria-label="Search marketplace categories"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#352d29] outline-none placeholder:text-[#a79890]"
              />

              <button
                type="submit"
                className="marketplace-button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#df604b] px-4 text-sm font-bold text-white transition duration-300 hover:bg-[#c94b38] sm:px-5"
              >
                Explore
                <MarketplaceIcon name="arrow" className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-[#766760] sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="text-[#d95e48]">✓</span>
                Multiple categories
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#d95e48]">✓</span>
                Connected shopping
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#d95e48]">✓</span>
                Pakistan-focused
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToCategories}
              className="marketplace-text-link mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#bd5945] transition-colors hover:text-[#983e30]"
            >
              Explore all categories
              <MarketplaceIcon name="arrow" className="h-4 w-4" />
            </button>
          </div>

          {/* HERO CATEGORY PANEL */}
          <div className="marketplace-reveal marketplace-reveal-delayed relative mx-auto w-full max-w-xl">
            <div className="marketplace-hero-panel relative overflow-hidden rounded-[30px] border border-white/90 bg-white/80 p-5 shadow-2xl shadow-[#a65c43]/10 backdrop-blur-xl sm:rounded-[36px] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c7755d]">
                    Your shopping destination
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#302b29] sm:text-3xl">
                    Umeed Marketplace
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#82736c]">
                    Find your next favourite.
                  </p>
                </div>

                <div className="marketplace-floating-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d95e48] sm:h-16 sm:w-16">
                  <MarketplaceIcon name="cart" className="h-8 w-8" />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
                {categories.slice(0, 4).map((category, index) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      scrollToCategories();
                    }}
                    className="marketplace-category-preview group rounded-2xl border border-[#f1e2d9] bg-white p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[#e9b8a5] hover:shadow-lg sm:p-5"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="marketplace-icon-box flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d95e48] transition duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#ffe4d8] sm:h-12 sm:w-12">
                      <MarketplaceIcon
                        name={category.icon}
                        className="h-6 w-6"
                      />
                    </span>

                    <span className="mt-4 block text-sm font-bold text-[#39312e]">
                      {category.name}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#8c7c74]">
                      {category.description}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={scrollToCategories}
                className="marketplace-category-footer mt-5 flex w-full items-center justify-between rounded-2xl bg-[#fff0e8] px-4 py-4 text-sm font-bold text-[#b65340] transition duration-300 hover:bg-[#ffe6da]"
              >
                Browse all categories
                <MarketplaceIcon name="arrow" className="h-4 w-4" />
              </button>
            </div>

            <div className="marketplace-floating-note absolute -left-3 top-1/3 hidden -translate-x-1/4 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:block">
              <p className="text-xs font-bold text-[#39312e]">
                Shop in one place
              </p>
              <p className="mt-1 text-[11px] text-[#8c7c74]">
                Discover more possibilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        id="marketplace-categories"
        className="scroll-mt-24 mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="marketplace-reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c76a53]">
              Find what you need
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302b29] sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#82736c] sm:text-base">
              Browse different categories and discover what you are looking
              for.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            className="flex w-full items-center rounded-xl border border-[#eadbd3] bg-white p-1.5 shadow-sm transition focus-within:border-[#df8069] sm:max-w-sm"
          >
            <span className="px-3 text-[#b59b8e]">
              <MarketplaceIcon name="search" className="h-5 w-5" />
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedCategory("");
              }}
              placeholder="Search categories..."
              aria-label="Search categories"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#a79890]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                aria-label="Clear category search"
                className="rounded-lg px-2 py-2 text-xs font-bold text-[#bd5945] hover:bg-[#fff0e8]"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-4">
          {filteredCategories.map((category, index) => (
            <button
              key={category.name}
              type="button"
              onClick={() =>
                setSelectedCategory((current) =>
                  current === category.name ? "" : category.name,
                )
              }
              aria-pressed={selectedCategory === category.name}
              className={`marketplace-category-card marketplace-reveal group rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
                selectedCategory === category.name
                  ? "border-[#df8069] bg-[#fff0e8] shadow-md"
                  : "border-[#f0e3dc] bg-white hover:border-[#edc1b1]"
              }`}
              style={{ animationDelay: `${Math.min(index * 65, 420)}ms` }}
            >
              <span
                className={`marketplace-icon-box flex h-12 w-12 items-center justify-center rounded-2xl text-[#d95e48] transition duration-300 group-hover:rotate-[-5deg] sm:h-14 sm:w-14 ${
                  selectedCategory === category.name
                    ? "bg-white"
                    : "bg-[#fff0e8] group-hover:bg-[#ffe4d8]"
                }`}
              >
                <MarketplaceIcon name={category.icon} className="h-6 w-6" />
              </span>

              <span className="mt-4 block text-sm font-bold text-[#39312e] sm:text-base">
                {category.name}
              </span>

              <span className="mt-2 block text-xs leading-5 text-[#8c7c74] sm:text-sm">
                {category.description}
              </span>

              <span className="mt-4 flex items-center gap-2 text-xs font-bold text-[#c65340]">
                {selectedCategory === category.name ? "Selected" : "Explore"}
                <MarketplaceIcon
                  name="arrow"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </button>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#e9c9bb] bg-white px-5 py-12 text-center">
            <MarketplaceIcon
              name="search"
              className="mx-auto h-10 w-10 text-[#d95e48]"
            />
            <h3 className="mt-4 text-lg font-bold text-[#39312e]">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-[#82736c]">
              Try another search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
              }}
              className="mt-5 rounded-xl bg-[#df604b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#c94b38]"
            >
              Show all categories
            </button>
          </div>
        )}

        {selectedCategory && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0ded5] bg-white p-4">
            <p className="text-sm text-[#766760]">
              Selected category:{" "}
              <strong className="text-[#39312e]">{selectedCategory}</strong>
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className="text-sm font-bold text-[#c75b46] hover:underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </section>

      {/* PROMOTIONAL HERO SLIDER */}
      <section className="mx-auto max-w-[1500px] px-5 pt-8 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#302b29] text-white">
          <div className="absolute inset-0 transition-colors duration-700" style={{ background: ["linear-gradient(110deg,#a94736,#df604b 58%,#f0a58b)","linear-gradient(110deg,#704f42,#c7755d 58%,#f1c8b5)","linear-gradient(110deg,#9c493e,#d98770 58%,#f5d7c8)"][activeBanner] }} />
          <div className="relative grid min-h-[240px] items-center gap-6 px-6 py-9 sm:min-h-[280px] sm:px-10 md:grid-cols-[1fr_auto] md:px-14">
            <div key={activeBanner} className="marketplace-banner-copy max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/75">{["Discover something new","Shopping made simple","Support local businesses"][activeBanner]}</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{["Good finds. Great possibilities.","Your next favourite is waiting.","Shop across stores, in one place."][activeBanner]}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/85">{["Explore products published by verified marketplace sellers.","Browse real listings and check product availability before ordering.","Discover independent sellers and products from different categories."][activeBanner]}</p><button type="button" onClick={() => document.getElementById("marketplace-products")?.scrollIntoView({behavior:"smooth"})} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#bd5945] transition hover:-translate-y-0.5">Explore products <MarketplaceIcon name="arrow" className="h-4 w-4"/></button></div>
            <div className="flex items-center gap-2 md:self-end">{[0,1,2].map((index) => <button key={index} type="button" aria-label={`Show banner ${index+1}`} onClick={() => setActiveBanner(index)} className={`h-2.5 rounded-full transition-all ${activeBanner === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}/>)}</div>
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="mx-auto max-w-[1500px] px-5 pt-12 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-[#f0d5c8] bg-[#fff0e8] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#bd5945]">Limited-time offers</p><h2 className="mt-2 text-2xl font-black text-[#302b29] sm:text-3xl">Flash Sale</h2><p className="mt-2 text-sm text-[#82736c]">Only products with a real sale price will appear here.</p></div><div className="flex items-center gap-2" aria-label="Demo countdown timer"><span className="rounded-xl bg-white px-3 py-2 text-center"><b className="block text-xl text-[#bd5945]">{String(Math.floor(saleSeconds/3600)).padStart(2,"0")}</b><small className="text-[10px] text-[#82736c]">HRS</small></span><span className="font-black text-[#bd5945]">:</span><span className="rounded-xl bg-white px-3 py-2 text-center"><b className="block text-xl text-[#bd5945]">{String(Math.floor((saleSeconds%3600)/60)).padStart(2,"0")}</b><small className="text-[10px] text-[#82736c]">MIN</small></span><span className="font-black text-[#bd5945]">:</span><span className="rounded-xl bg-white px-3 py-2 text-center"><b className="block text-xl text-[#bd5945]">{String(saleSeconds%60).padStart(2,"0")}</b><small className="text-[10px] text-[#82736c]">SEC</small></span></div></div>
          {catalogueLoading ? <div className="marketplace-shimmer mt-6 h-32 rounded-2xl"/> : saleProducts.length ? <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{saleProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <p className="mt-5 rounded-xl bg-white/80 p-4 text-sm text-[#82736c]">No active sale products are published yet. Countdown is a visual placeholder and is not connected to a campaign end time.</p>}
        </div>
      </section>

      <ProductRow title="Featured Products" eyebrow="Picked for you" items={featuredProducts}/>
      <ProductRow title="New Arrivals" eyebrow="Just added" items={newArrivals}/>
      <ProductRow title="Best Sellers" eyebrow="Customer favourites" items={bestSellers}/>

      {/* TOP VENDORS */}
      <section className="border-y border-[#f0e3dc] bg-white"><div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12"><div className="mb-6"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c76a53]">Discover independent stores</p><h2 className="mt-2 text-2xl font-black text-[#302b29] sm:text-3xl">Top Vendors & Stores</h2></div>{catalogueLoading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[0,1,2,3].map(n=><div key={n} className="marketplace-shimmer h-36 rounded-2xl"/>)}</div> : stores.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{stores.slice(0,8).map((store)=><article key={store.id} className="rounded-2xl border border-[#f0e3dc] bg-[#fffaf7] p-5 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#fff0e8] text-xl font-black text-[#bd5945]">{store.logo_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={store.logo_url} alt={`${store.name} logo`} loading="lazy" className="h-full w-full object-cover"/> : store.name.slice(0,1).toUpperCase()}</div><h3 className="mt-3 truncate font-bold text-[#39312e]">{store.name}</h3><p className="mt-1 text-xs text-[#9b6b22]">★ {typeof store.rating === "number" ? store.rating.toFixed(1) : "New store"} {store.is_verified ? "· Verified" : ""}</p><Link href={store.slug ? `/marketplace/stores/${store.slug}` : "/marketplace/stores"} className="mt-4 inline-flex rounded-xl border border-[#edc4b5] px-4 py-2 text-xs font-bold text-[#bd5945] hover:bg-[#fff0e8]">Visit Store</Link></article>)}</div> : <p className="rounded-xl border border-dashed border-[#e9c9bb] p-6 text-sm text-[#82736c]">Approved stores will appear here when the catalogue API provides store records.</p>}</div></section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12"><div className="mb-6"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c76a53]">Real experiences matter</p><h2 className="mt-2 text-2xl font-black text-[#302b29] sm:text-3xl">Customer Reviews</h2></div><div className="rounded-2xl border border-dashed border-[#e9c9bb] bg-white p-7 text-sm leading-6 text-[#82736c]">Customer testimonials will appear here once real, approved reviews are available. We do not display invented customer names or quotes.</div></section>

      {/* TRUST + PAKISTAN PAYMENT INFORMATION */}
      <section className="border-y border-[#f0e3dc] bg-white"><div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-4 px-5 py-8 sm:grid-cols-4 sm:px-8 lg:px-12"><div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-4"><MarketplaceIcon name="shield" className="h-6 w-6 shrink-0 text-[#d95e48]"/><div><b className="block text-sm text-[#39312e]">Verified Seller</b><span className="text-xs text-[#82736c]">Where verification is confirmed</span></div></div><div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-4"><MarketplaceIcon name="package" className="h-6 w-6 shrink-0 text-[#d95e48]"/><div><b className="block text-sm text-[#39312e]">Return Policy</b><span className="text-xs text-[#82736c]">Check policy before ordering</span></div></div><div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-4"><MarketplaceIcon name="truck" className="h-6 w-6 shrink-0 text-[#d95e48]"/><div><b className="block text-sm text-[#39312e]">Cash on Delivery</b><span className="text-xs text-[#82736c]">Only where available</span></div></div><div className="flex items-center gap-3 rounded-xl bg-[#fffaf7] p-4"><MarketplaceIcon name="shield" className="h-6 w-6 shrink-0 text-[#d95e48]"/><div><b className="block text-sm text-[#39312e]">Secure Payment</b><span className="text-xs text-[#82736c]">Payment options at checkout</span></div></div></div></section>

      {cartNotice && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-2xl bg-[#302b29] px-5 py-3 text-sm font-bold text-white shadow-xl">{cartNotice}</div>}
      {/* PRODUCTS ANCHOR FOR NAVIGATION */}
      <div id="marketplace-products" className="scroll-mt-24" />

      {/* MARKETPLACE BENEFITS */}
      <section
        id="marketplace-about"
        className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="marketplace-reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c76a53]">
            The Umeed experience
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302b29] sm:text-4xl">
            A marketplace built around trust
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#82736c] sm:text-base">
            A connected shopping platform designed to help customers discover
            products and businesses through one marketplace.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="marketplace-benefit marketplace-reveal group rounded-3xl border border-[#f0e3dc] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#edc1b1] hover:shadow-xl hover:shadow-[#9d654e]/5"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="marketplace-icon-box flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d95e48] transition duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#ffe4d8]">
                <MarketplaceIcon name={benefit.icon} />
              </span>

              <h3 className="mt-5 text-lg font-extrabold text-[#39312e]">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#82736c]">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* BUYER CTA */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="marketplace-buyer-cta relative mx-auto max-w-[1350px] overflow-hidden rounded-[28px] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="marketplace-cta-orb" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                Your shopping journey starts here
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Discover something you love.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Explore categories and discover what is available on Umeed
                Marketplace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setSearch("");
                scrollToCategories();
              }}
              className="marketplace-button inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#c65340] transition duration-300 hover:-translate-y-1 hover:bg-[#fff3ed] sm:self-center"
            >
              Start Exploring
              <MarketplaceIcon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#f0e3dc] bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="text-sm font-extrabold text-[#39312e]">
              Umeed Marketplace
            </p>

            <p className="mt-1 text-xs text-[#92847d]">
              Part of Umeed of Life
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm"
          >
            <a
              href="#marketplace-categories"
              className="text-[#766760] transition hover:text-[#c65340]"
            >
              Categories
            </a>

            <a
              href="#marketplace-products"
              className="text-[#766760] transition hover:text-[#c65340]"
            >
              Products
            </a>

            <a
              href="#marketplace-about"
              className="text-[#766760] transition hover:text-[#c65340]"
            >
              About Us
            </a>

            <Link
              href="/"
              className="text-[#766760] transition hover:text-[#c65340]"
            >
              Umeed of Life
            </Link>
          </nav>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#92847d]">
            <Link href="/marketplace/returns" className="hover:text-[#c65340]">Returns</Link>
            <Link href="/marketplace/terms" className="hover:text-[#c65340]">Terms</Link>
            <Link href="/marketplace/privacy" className="hover:text-[#c65340]">Privacy</Link>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-[#c65340]">WhatsApp (number not configured)</a>
          </div>
          <p className="text-xs text-[#92847d]">© {currentYear ?? 2026} Umeed of Life · Cart items: {cartCount}</p>
          
        </div>
      </footer>

      {/* MARKETPLACE-ONLY ANIMATIONS */}
      <style jsx>{`
        .marketplace-hero {
          background: linear-gradient(
            135deg,
            #fff8f3 0%,
            #ffede3 52%,
            #ffdfd0 100%
          );
        }

        .marketplace-orb {
          position: absolute;
          pointer-events: none;
          border-radius: 9999px;
          filter: blur(70px);
          z-index: -1;
        }

        .marketplace-orb-one {
          width: 330px;
          height: 330px;
          right: -70px;
          top: -80px;
          background: rgb(245 180 154 / 30%);
          animation: marketplace-drift 12s ease-in-out infinite alternate;
        }

        .marketplace-orb-two {
          width: 300px;
          height: 300px;
          left: 10%;
          bottom: -130px;
          background: rgb(255 255 255 / 80%);
          animation: marketplace-drift 15s ease-in-out infinite alternate-reverse;
        }

        .marketplace-reveal {
          animation: marketplace-fade-up 750ms cubic-bezier(.2,.7,.2,1) both;
        }

        .marketplace-reveal-delayed {
          animation-delay: 140ms;
        }

        .marketplace-title span {
          color: #df604b;
          display: inline-block;
          animation: marketplace-title-in 850ms 160ms both;
        }

        .marketplace-floating-icon {
          animation: marketplace-float 4s ease-in-out infinite;
        }

        .marketplace-floating-note {
          animation: marketplace-float 5s ease-in-out infinite reverse;
        }

        .marketplace-category-preview,
        .marketplace-category-card,
        .marketplace-benefit {
          animation-fill-mode: both;
        }

        .marketplace-empty-icon {
          animation: marketplace-float 4.5s ease-in-out infinite;
        }

        .marketplace-buyer-cta {
          background: linear-gradient(120deg, #df604b 0%, #c84f3c 100%);
        }

        .marketplace-cta-orb {
          position: absolute;
          width: 270px;
          height: 270px;
          right: -65px;
          top: -120px;
          border: 34px solid rgb(255 255 255 / 12%);
          border-radius: 9999px;
          pointer-events: none;
          animation: marketplace-drift 11s ease-in-out infinite alternate;
        }

        .marketplace-button:active {
          transform: scale(.97);
        }

        .marketplace-text-link:hover svg {
          transform: translateX(4px);
        }

        .marketplace-shimmer {
          background: linear-gradient(100deg, #f6eee9 20%, #fffaf7 38%, #f6eee9 58%);
          background-size: 200% 100%;
          animation: marketplace-shimmer 1.3s ease-in-out infinite;
        }
        .marketplace-banner-copy { animation: marketplace-fade-up 500ms ease both; }
        @keyframes marketplace-shimmer {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }
        @keyframes marketplace-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marketplace-title-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marketplace-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes marketplace-drift {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(-15px, 12px) scale(1.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketplace-home *,
          .marketplace-home *::before,
          .marketplace-home *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}