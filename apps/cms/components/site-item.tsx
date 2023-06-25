import Link from "next/link";
import { Site } from "@prisma/client";

import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteOperations } from "@/components/site-operations";

interface SiteItemProps {
  site: Pick<Site, "id" | "name" | "createdAt">;
}

export function SiteItem({ site }: SiteItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/sites/${site.id}`}
          className="font-semibold hover:underline"
        >
          {site.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(site.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <SiteOperations site={{ id: site.id, name: site.name }} />
    </div>
  );
}

SiteItem.Skeleton = function SiteItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
