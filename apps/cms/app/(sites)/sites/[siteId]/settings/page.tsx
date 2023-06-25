import { notFound, redirect } from "next/navigation";
import { Site, User } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { SiteSettingsForm } from "@/components/site-settings-form";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

async function getSiteForUser(siteId: Site["id"], userId: User["id"]) {
  return await db.site.findFirst({
    where: {
      id: siteId,
    },
  });
}

export default async function SettingsPage({ params }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const site = await getSiteForUser(params.siteId, user.id);

  if (!site) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your website settings."
      />
      <div className="grid gap-10">
        <SiteSettingsForm site={{ id: site.id, name: site.name || "" }} />
      </div>
    </DashboardShell>
  );
}
