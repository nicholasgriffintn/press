import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
            Page Not Found
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 dark:text-white">
            Could not find requested resource
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700 dark:text-white"
            >
              Go back to the Homepage
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
