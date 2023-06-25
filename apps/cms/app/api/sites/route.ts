import { Role, VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";

const tenantCreateSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const tenantUsers = await db.user.findMany({
      where: {
        id: user.id,
      },
      include: {
        TenantUser: {
          include: {
            tenant: {
              include: {
                Site: {
                  include: {
                    ContentType: true,
                    ContentStatus: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(tenantUsers));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // If user is on a free plan.
    // Check if user has reached limit of 1 tenant.
    if (!subscriptionPlan?.isPro) {
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
      });
      const sites = users.reduce((prev, next) => {
        const site = next.TenantUser.map(
          (tenantUser) => tenantUser.tenant.Site
        ).flat();

        if (site.length) {
          return [...site, ...prev];
        }

        return prev;
      }, []);

      if (sites.length >= 1) {
        throw new RequiresProPlanError();
      }
    }

    const json = await req.json();
    const body = tenantCreateSchema.parse(json);

    const tenant = await db.tenant.create({
      data: {
        name: body.name,
        url: body.url,
        createdBy: user.id,
        updatedBy: user.id,
      },
      select: {
        id: true,
      },
    });

    await db.tenantUser.create({
      data: {
        status: VerificationStatus.verified,
        role: Role.admin,
        tenantId: tenant.id,
        userId: user.id,
        createdBy: user.id,
      },
      select: {
        id: true,
      },
    });

    const site = await db.site.create({
      data: {
        name: body.name,
        url: body.url,
        createdBy: user.id,
        tenantId: tenant.id,
      },
      select: {
        id: true,
      },
    });

    await db.contentStatus.create({
      data: {
        siteId: site.id,
        name: "Published",
        roles: Role.admin,
        createdBy: user.id,
      },
      select: {
        id: true,
      },
    });

    await db.contentType.create({
      data: {
        siteId: site.id,
        title: "Post",
        slug: "/editor/posts/",
        createdBy: user.id,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(site));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 });
    }

    console.error(error);

    return new Response(null, { status: 500 });
  }
}
