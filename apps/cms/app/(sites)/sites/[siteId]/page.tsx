import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Site, User, ContentType } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

async function getSiteForUser(siteId: Site["id"], userId: User["id"]) {
  return await db.site.findFirst({
    where: {
      id: siteId,
    },
  })
}

interface SitesPageProps {
  params: { siteId: string }
}

export default async function SitesPage({ params }: SitesPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const site = await getSiteForUser(params.siteId, user.id)

  if (!site) {
    notFound()
  }

  const contentType = await db.contentType.findFirst({
    where: {
      siteId: site.id,
    },
  })

  if (!contentType) {
    notFound()
  }

  const contentStatus = await db.contentStatus.findFirst({
    where: {
      siteId: site.id,
    },
  })

  if (!contentStatus) {
    notFound()
  }

  const posts = await db.content.findMany({
    where: {
      siteId: site.id,
      contentTypeId: contentType.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
      type: {
        select: {
          title: true,
        },
      },
      status: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={site.name}
        text={site.description || "Welcome to your site's dashboard!"}
      >
        <Link href={`/sites/${site.id}/content/types`}>Content Types</Link>
        <Link href={`/sites/${site.id}/content/statuses`}>
          Content Statuses
        </Link>
        <Link href={`/sites/${site.id}/settings`}>Settings</Link>
        <PostCreateButton
          contentType={contentType}
          contentStatus={contentStatus}
          siteId={site.id}
        />
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            <div className="flex items-center justify-between p-4">
              <h2>Content</h2>
            </div>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No {contentType.title.toLowerCase()}s created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any {contentType.title.toLowerCase()}s yet.
              Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton
              variant="outline"
              contentType={contentType}
              contentStatus={contentStatus}
              siteId={site.id}
            />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
