import { isAdmin } from "@/lib/auth-admin";
import { HeaderContent } from "./header-content";

export async function Header() {
  const showAdmin = await isAdmin();
  return <HeaderContent showAdmin={showAdmin} />;
}
