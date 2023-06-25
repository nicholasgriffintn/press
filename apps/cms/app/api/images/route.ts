import { mkdir, stat, writeFile } from "fs/promises"
import { join } from "path"
import * as dateFn from "date-fns"
import sizeOf from "image-size"
import mime from "mime"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user is on a free plan.
    /* if (!subscriptionPlan?.isPro) {
        throw new RequiresProPlanError()
    } */

    const formData = await req.formData()
    const file = formData.get("images") as Blob | null
    if (!file) {
      throw new Error("File blob is required.")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const relativeUploadDir = `/uploads/${dateFn.format(Date.now(), "dd-MM-Y")}`
    const uploadDir = join(process.cwd(), "public", relativeUploadDir)

    try {
      await stat(uploadDir)
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true })
      } else {
        console.error(
          "Error while trying to create directory when uploading a file\n",
          e
        )
        throw new Error("Something went wrong.")
      }
    }

    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const filename = `${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${uniqueSuffix}.${mime.getExtension(file.type)}`
      await writeFile(`${uploadDir}/${filename}`, buffer)

      const dimensions = sizeOf(`${uploadDir}/${filename}`)
      return new Response(
        JSON.stringify({
          url: `${relativeUploadDir}/${filename}`,
          width: dimensions.width,
          height: dimensions.height,
        })
      )
    } catch (e) {
      console.error("Error while trying to upload a file\n", e)
      throw new Error("Something went wrong.")
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 })
    }

    console.error(error)

    return new Response(null, { status: 500 })
  }
}
