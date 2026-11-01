"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

type Category = { id: string; name: string };
type Product = Record<string, unknown> & { id: string; name: string; status: string };
type FormValues = {
  name: string; category_id: string; brand: string; model: string; sku: string;
  description: string; highlights: string; specifications: string;
  price: string; compare_at_price: string; stock_quantity: string;
  weight_grams: string; length_cm: string; width_cm: string; height_cm: string;
  warranty: string; package_contents: string;
};
const empty: FormValues = {
  name: "", category_id: "", brand: "", model: "", sku: "", description: "",
  highlights: "", specifications: "", price: "", compare_at_price: "", stock_quantity: "0",
  weight_grams: "", length_cm: "", width_cm: "", height_cm: "", warranty: "", package_contents: "",
};
const textFields: (keyof FormValues)[] = ["brand", "model", "sku", "highlights", "specifications", "warranty", "package_contents"];
const numericFields: (keyof FormValues)[] = ["weight_grams", "length_cm", "width_cm", "height_cm"];
const inputStyle = "mt-2 w-full rounded-xl border border-[#ead5cb] bg-white px-4 py-3 text-[#432a24] outline-none focus:border-[#bc5346] focus:ring-2 focus:ring-[#bc5346]/15";
const sectionStyle = "rounded-3xl border border-[#efdcd3] bg-white p-6 shadow-sm sm:p-8";

export default function ProfessionalProductForm() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const pathname = usePathname();
  const editing = pathname.endsWith("/edit");
  const productId = editing ? params.id : undefined;
  const [values, setValues] = useState<FormValues>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draftStatus, setDraftStatus] = useState("draft");
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/marketplace/vendor/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load categories.");
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      if (!productId) return;
      const [detailResponse, imageResponse] = await Promise.all([
        fetch(`/api/marketplace/vendor/products/${productId}`, { cache: "no-store" }),
        fetch(`/api/marketplace/vendor/products/${productId}/images`, { cache: "no-store" }),
      ]);
      const detail = await detailResponse.json();
      if (!detailResponse.ok) throw new Error(detail.error || "Unable to load product.");
      const product = detail.product as Product;
      setDraftStatus(product.status);
      setValues(Object.fromEntries(Object.keys(empty).map((key) => [key, product[key] == null ? "" : String(product[key])])) as FormValues);
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        setExistingImages(Array.isArray(imageData.images) ? imageData.images : []);
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load product."); }
    finally { setLoading(false); }
  }, [productId]);
  useEffect(() => { void load(); }, [load]);

  function set(key: keyof FormValues, value: string) { setValues((previous) => ({ ...previous, [key]: value })); }
  function pickImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length + existingImages.length > 5) { setError("Maximum 5 images per product, including existing images."); return; }
    if (selected.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024 || !file.size)) {
      setError("Only JPG, PNG or WebP images up to 5 MB each are allowed."); return;
    }
    setFiles(selected);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      if (draftStatus !== "draft") throw new Error("Only draft products can be edited.");
      if (!values.category_id) throw new Error("Choose a category.");
      if (Number(values.price) <= 0 || !Number.isSafeInteger(Number(values.stock_quantity)) || Number(values.stock_quantity) < 0) throw new Error("Enter a valid price and stock quantity.");
      let id = productId;
      const basic = {
        name: values.name.trim(), category_id: values.category_id,
        description: values.description.trim(), price: Number(values.price), stock_quantity: Number(values.stock_quantity),
      };
      if (!id) {
        const create = await fetch("/api/marketplace/vendor/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(basic) });
        const result = await create.json();
        if (!create.ok) throw new Error(result.error || "Unable to create product.");
        id = result.product?.id;
        if (!id) throw new Error("Product was created but its ID was not returned. Check My Products.");
      }
      const extra: Record<string, string | number | null> = { ...basic };
      for (const key of textFields) extra[key] = values[key].trim() || null;
      for (const key of numericFields) extra[key] = values[key] === "" ? null : Number(values[key]);
      extra.compare_at_price = values.compare_at_price === "" ? null : Number(values.compare_at_price);
      const patch = await fetch(`/api/marketplace/vendor/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(extra) });
      const patchResult = await patch.json();
      if (!patch.ok) throw new Error(`Draft saved, but additional details failed: ${patchResult.error || "Unknown error"}. Open the draft to retry.`);
      let uploaded = 0;
      for (const file of files) {
        const form = new FormData(); form.set("product_id", id); form.set("image", file);
        const response = await fetch("/api/marketplace/vendor/products/images", { method: "POST", body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(`Product saved and ${uploaded} image(s) uploaded. Image upload stopped: ${result.error || "Unknown error"}. Open the draft to retry.`);
        uploaded++;
      }
      setSuccess(`Draft saved successfully${uploaded ? ` with ${uploaded} image(s)` : ""}. It is not public yet.`);
      setFiles([]);
      router.replace(`/marketplace/vendor/products/${id}/edit`);
      router.refresh();
      if (productId) void load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save product."); }
    finally { setSaving(false); }
  }

  async function removeDraft() {
    if (!productId || deleteBusy || !window.confirm("Delete this draft product? This cannot be undone.")) return;
    setDeleteBusy(true); setError("");
    try {
      const response = await fetch(`/api/marketplace/vendor/products/${productId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete draft.");
      router.replace("/marketplace/vendor/dashboard");
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Delete failed."); }
    finally { setDeleteBusy(false); }
  }

  const field = (label: string, key: keyof FormValues, props: { type?: string; required?: boolean; placeholder?: string; step?: string; min?: string } = {}) => (
    <label className="block text-sm font-bold text-[#64443a]" key={key}>{label}
      <input className={inputStyle} value={values[key]} onChange={(event) => set(key, event.target.value)} type={props.type || "text"} required={props.required} placeholder={props.placeholder} min={props.min} step={props.step} maxLength={props.type === "number" ? undefined : 500} />
    </label>
  );
  const area = (label: string, key: keyof FormValues, placeholder: string, maxLength: number) => (
    <label className="block text-sm font-bold text-[#64443a]">{label}
      <textarea className={inputStyle} rows={4} maxLength={maxLength} placeholder={placeholder} value={values[key]} onChange={(event) => set(key, event.target.value)} />
    </label>
  );

  return (
    <main className="text-[#432a24]">
      <div className="max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Link href="/marketplace/vendor/dashboard" className="text-sm font-bold text-[#ad493e] hover:underline">← Back to Seller Center</Link>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#c45c48]">Umeed Marketplace · Seller Center</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{editing ? "Edit Product" : "Add New Product"}</h1>
            <p className="mt-2 text-sm text-[#8b7168]">Complete product details and select up to 5 photos in one form. Saved products remain drafts.</p>
          </div>
          <span className="rounded-full bg-[#ffeadf] px-4 py-2 text-xs font-black uppercase text-[#a94739]">{draftStatus}</span>
        </div>
        {loading ? <p className={sectionStyle}>Loading product editor...</p> : <>
          {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
          <form onSubmit={submit} className="space-y-6">
            <section className={sectionStyle}><h2 className="mb-5 text-xl font-black">01 · Basic Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">{field("Product title *", "name", { required: true, placeholder: "e.g. Wireless Bluetooth Headphones" })}
                <label className="block text-sm font-bold text-[#64443a]">Category *<select required className={inputStyle} value={values.category_id} onChange={(event) => set("category_id", event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                {field("Brand", "brand", { placeholder: "Brand name" })}{field("Model", "model", { placeholder: "Model number" })}{field("Seller SKU", "sku", { placeholder: "Your stock reference" })}</div>
              <div className="mt-5 space-y-5">{area("Full description", "description", "Explain what the customer receives", 5000)}{area("Key features", "highlights", "One feature per line", 4000)}{area("Specifications", "specifications", "Material, dimensions, compatibility etc.", 4000)}</div>
            </section>
            <section className={sectionStyle}><h2 className="mb-5 text-xl font-black">02 · Product Photos</h2>
              <p className="mb-4 text-sm text-[#8b7168]">JPG, PNG or WebP · Up to 5 images total · 5 MB each. The first uploaded image becomes the primary photo.</p>
              {existingImages.length > 0 && <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">{existingImages.map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-[#ead5cb]"><img src={image.image_url} alt="Existing product" className="aspect-square w-full object-cover" /></div>)}</div>}
              <input aria-label="Product images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pickImages} className="block w-full rounded-xl border border-dashed border-[#dca99b] bg-[#fff9f5] p-5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#a83f36] file:px-4 file:py-2 file:font-bold file:text-white" />
              {files.length > 0 && <p className="mt-3 text-sm text-[#805e53]">Selected: {files.map((file) => file.name).join(", ")}</p>}
            </section>
            <section className={sectionStyle}><h2 className="mb-5 text-xl font-black">03 · Price & Inventory</h2><div className="grid gap-5 sm:grid-cols-3">
              {field("Selling price (PKR) *", "price", { type: "number", required: true, min: "0.01", step: "0.01" })}
              {field("Original price (PKR)", "compare_at_price", { type: "number", min: "0.01", step: "0.01" })}
              {field("Available stock *", "stock_quantity", { type: "number", required: true, min: "0", step: "1" })}
            </div></section>
            <section className={sectionStyle}><h2 className="mb-5 text-xl font-black">04 · Packaging & Shipping</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {field("Weight (grams)", "weight_grams", { type: "number", min: "0", step: "1" })}
              {field("Length (cm)", "length_cm", { type: "number", min: "0", step: "0.01" })}
              {field("Width (cm)", "width_cm", { type: "number", min: "0", step: "0.01" })}
              {field("Height (cm)", "height_cm", { type: "number", min: "0", step: "0.01" })}
            </div><div className="mt-5 grid gap-5 sm:grid-cols-2">{field("Warranty", "warranty", { placeholder: "e.g. 12 months manufacturer warranty" })}{field("Package contents", "package_contents", { placeholder: "e.g. Device, charging cable, manual" })}</div></section>
            <section className={sectionStyle}><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-black">Save Product Draft</h2><p className="mt-1 text-sm text-[#8b7168]">This does not publish the product to customers.</p></div>
              <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving || draftStatus !== "draft"} className="rounded-xl bg-[#a83f36] px-6 py-3 font-bold text-white hover:bg-[#8c3029] disabled:opacity-50">{saving ? "Saving details & images..." : editing ? "Save Changes" : "Save Product & Images"}</button>
                {editing && <button type="button" disabled={deleteBusy || saving || draftStatus !== "draft"} onClick={() => void removeDraft()} className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">{deleteBusy ? "Deleting..." : "Delete Draft"}</button>}</div></div></section>
          </form>
        </>}
      </div>
    </main>
  );
}
