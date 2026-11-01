import { redirect } from "next/navigation";
import { requireCentralRole } from "@/lib/supabase/central-finance-auth";
import AnnouncementsClient from "@/components/management/AnnouncementsClient";
export default async function NewsPage(){const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]);if(!auth.ok)redirect("/management/login");return <AnnouncementsClient/>}
