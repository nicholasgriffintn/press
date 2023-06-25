import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const reqUrl = new URL(req.url);
    const values = Object.fromEntries(reqUrl.searchParams);
    const url = values.url;

    const response = await fetch(
      `https://opengraph.io/api/1.0/site/${encodeURIComponent(url)}?app_id=${
        process.env.OPENGRAPH_API_KEY
      }`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response?.ok) {
      return new Response("No response from opengraph", { status: 500 });
    }

    const json = await response.json();

    return new Response(
      JSON.stringify({
        success: 1,
        meta: json.openGraph,
      })
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
