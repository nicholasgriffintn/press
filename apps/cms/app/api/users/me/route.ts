import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  siteId: z.string(),
  contentStatusId: z.string(),
  contentTypeId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    if (!user) {
      return new Response("Unauthorized", { status: 403 })
    }

    return new Response(JSON.stringify(user))
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
