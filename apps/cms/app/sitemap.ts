import { headers } from "next/headers";

import { getPostsForSite } from "@/lib/fetchers";
import { env } from "@/env.mjs";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "press.nicholasgriffin.dev";

  const posts = await getPostsForSite(domain);

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...posts.map(({ slug }: { slug: string }) => ({
      url: `https://${domain}/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
