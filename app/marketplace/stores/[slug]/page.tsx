import Link from "next/link";
import MarketplaceWorkspace from "../../components/MarketplaceWorkspace";
import EmptyState from "../../components/EmptyState";
export const instant = false;
export default async function StoreDetailPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <MarketplaceWorkspace title="Store details" description={`Store slug: ${slug}. Live store information and published products will be loaded after the catalogue API is connected.`}><EmptyState title="Store details are not loaded" description="The store may not exist, may be inactive, or the store-detail API has not been implemented yet." action={<Link href="/marketplace/stores" className="mp-secondary">Browse stores</Link>}/></MarketplaceWorkspace>}
