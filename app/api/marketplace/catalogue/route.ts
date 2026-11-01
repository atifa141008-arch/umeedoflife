import { unstable_rethrow } from "next/navigation";
import { connection, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Next.js Cache Components: wait for a real request before reading cookies.
    await connection();
    const supabase = await createClient();

    const [productsResult, categoriesResult, bannersResult, vendorsResult] =
      await Promise.all([
        supabase
          .from("marketplace_products")
          .select(`
            id, name, slug, description, price, compare_at_price,
            stock_quantity, is_featured, category_id,
            vendor_application_id, created_at,
            marketplace_product_images (
              id, image_url, alt_text, sort_order, is_primary
            )
          `)
          .eq("status", "active")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(48),
        supabase
          .from("marketplace_categories")
          .select("id, name, slug, description, image_url, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("marketplace_banners")
          .select("id, title, subtitle, image_url, button_text, button_url, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("marketplace_public_stores")
          .select("id, business_name, city"),
      ]);

    if (productsResult.error || categoriesResult.error || bannersResult.error || vendorsResult.error) {
      console.error("Marketplace catalogue query failed:", {
        products: productsResult.error?.code,
        categories: categoriesResult.error?.code,
        banners: bannersResult.error?.code,
        stores: vendorsResult.error?.code,
      });
      return NextResponse.json(
        { error: "Marketplace catalogue load nahi ho saka." },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    const categories = categoriesResult.data ?? [];
    // This view already filters for approved and active vendors in SQL.
    const vendors = vendorsResult.data ?? [];
    const approvedVendors = new Map(vendors.map((vendor) => [vendor.id, vendor]));

    const products = (productsResult.data ?? [])
      .filter((product) =>
        Boolean(product.vendor_application_id && approvedVendors.has(product.vendor_application_id)),
      )
      .map((product) => {
        const images = [...(product.marketplace_product_images ?? [])].sort((a, b) => {
          if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
          return a.sort_order - b.sort_order;
        });
        const primaryImage = images[0] ?? null;
        const otherImage = images.find((image) => image.id !== primaryImage?.id) ?? null;
        const vendor = product.vendor_application_id
          ? approvedVendors.get(product.vendor_application_id)
          : null;
        const category = categories.find((item) => item.id === product.category_id);

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          compare_at_price: product.compare_at_price == null ? null : Number(product.compare_at_price),
          image_url: primaryImage?.image_url ?? null,
          hover_image_url: otherImage?.image_url ?? null,
          vendor_name: vendor?.business_name ?? null,
          vendor_verified: Boolean(vendor),
          rating: null,
          review_count: 0,
          stock_quantity: product.stock_quantity,
          created_at: product.created_at,
          is_featured: product.is_featured,
          is_best_seller: false,
          is_new_arrival: false,
          category: category?.name ?? null,
        };
      });

    const stores = vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.business_name,
      logo_url: null,
      rating: null,
      is_verified: true,
      slug: null,
    }));

    return NextResponse.json(
      {
        products,
        stores,
        categories,
        banners: bannersResult.data ?? [],
        meta: {
          productCount: products.length,
          categoryCount: categories.length,
          bannerCount: bannersResult.data?.length ?? 0,
          storeCount: stores.length,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Let Next.js handle prerender cancellation instead of logging it as an API failure.
    unstable_rethrow(error);
    console.error("Marketplace catalogue API error:", error);
    return NextResponse.json(
      { error: "Catalogue load karte waqt unexpected error aaya." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
