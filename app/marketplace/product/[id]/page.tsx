import Link from "next/link";
import MarketplaceWorkspace from "../../components/MarketplaceWorkspace";
import EmptyState from "../../components/EmptyState";
export const instant = false;
export default async function ProductDetailPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <MarketplaceWorkspace title="Product details" description={`Product reference: ${id}. The live listing, seller, price, stock, variants, shipping and return policy must be fetched from the marketplace API.`}><EmptyState title="Product listing not loaded" description="No sample product has been invented. Connect the catalogue API to show verified product details and availability." action={<Link href="/marketplace" className="mp-primary">Back to marketplace</Link>}/></MarketplaceWorkspace>}
