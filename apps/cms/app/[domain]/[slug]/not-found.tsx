import { headers } from "next/headers";

import { env } from "@/env.mjs";
import { getSiteData } from "@/lib/fetchers";

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList
    .get("host")
    ?.replace(".localhost:3000", `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const data = await getSiteData(domain as string);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-cal text-4xl">{data ? `${data.name}: ` : ""}404</h1>
      <p className="text-lg text-stone-500">
        {data
          ? data.message404
          : "Whoops! You found a page that doesn't exist."}
      </p>
    </div>
  );
}
