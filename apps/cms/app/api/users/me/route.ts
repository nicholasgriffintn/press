import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    if (!user) {
      return new Response("Unauthorized", { status: 403 });
    }

    return new Response(JSON.stringify(user));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
