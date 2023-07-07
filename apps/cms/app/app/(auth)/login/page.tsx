import { Suspense } from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import LoginButton from "./login-button";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md dark:text-white">
      <div className="p-4">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Icons.logo className="mx-auto h-6 w-6" />
        </Link>
        <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
          Press by Nicholas Griffin
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
          A side project that aims to be a universal CMS that users can use for
          creating content and managing their site.
        </p>

        <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
          <Suspense
            fallback={
              <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
            }
          >
            <div className="grid gap-6">
              <LoginForm />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <LoginButton />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
