import { redirect } from "next/navigation";



import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { SiteCreateButton } from "@/components/site-create-button";
import { SiteItem } from "@/components/site-item";









export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const users = await db.user.findMany({
    where: {
      id: user.id,
    },
    include: {
      TenantUser: {
        include: {
          tenant: {
            include: {
              Site: true,
            },
          },
        },
      },
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Select a site to manage." />
      <div>
        {users?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {users.map((user) => {
              return (
                <>
                  {user.TenantUser.map((tenantUser) => {
                    return (
                      <>
                        {tenantUser.tenant.Site.map((site) => {
                          return <SiteItem site={site} />
                        })}
                      </>
                    )
                  })}
                </>
              )
            })}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="settings" />
            <EmptyPlaceholder.Title>
              You don&apos;t have any sites yet!
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Get another user to invite you to one, or create your own below:
            </EmptyPlaceholder.Description>
            <SiteCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}