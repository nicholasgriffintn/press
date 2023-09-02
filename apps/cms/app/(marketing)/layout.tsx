import Link from "next/link";

import "@/styles/marketing.css";
import "@/styles/mdx.css";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { DocsSearch } from "@/components/search";
import { SiteFooter } from "@/components/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <div className="flex flex-1 items-center space-x-4 sm:justify-end">
            <div className="flex-1 sm:grow-0 hidden md:block">
              <DocsSearch />
            </div>
            <nav className="flex space-x-4">
              <Link
                href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/login`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
