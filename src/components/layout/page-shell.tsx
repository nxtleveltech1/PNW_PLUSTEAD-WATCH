import { Header } from "./header-server";
import { Footer } from "./footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
