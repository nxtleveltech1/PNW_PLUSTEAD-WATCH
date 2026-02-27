import { HeaderContent } from "./header-content";

/** Use in client components (e.g. error boundaries). Hides Admin link. */
export function HeaderClient() {
  return <HeaderContent showAdmin={false} />;
}
