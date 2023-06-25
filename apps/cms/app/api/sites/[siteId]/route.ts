import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const routeContextSchema = z.object({
  params: z.object({
    siteId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this site.
    if (!(await verifyCurrentUserHasAccessToSite(params.siteId))) {
      return new Response(null, { status: 403 });
    }

    // Delete the site.
    await db.site.delete({
      where: {
        id: params.siteId as string,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    console.error(error);

    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToSite(siteId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.site.count({
    where: {
      id: siteId,
      createdBy: session?.user.id,
    },
  });

  return count > 0;
}
