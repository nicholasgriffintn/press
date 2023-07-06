"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";
import clsx from "clsx";
import va from "@vercel/analytics";

import LoadingDots from "@/components/icons/loading-dots";
import { loginUser } from "@/lib/actions";

export default function LoginForm({}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams?.get("from") || "/dashboard";

  return (
    <form
      action={async (data: FormData) =>
        loginUser(data, callbackUrl).then((res) => {
          if (res.ok) {
            va.track("User logged in");
            router.push(`/`);
            toast.success(
              `We sent a login link to your email. Be sure to check your spam too.`
            );
          } else {
            toast.error("Your sign in request failed. Please try again.");
          }
        })
      }
      className="dark:text-white"
    >
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          autoComplete="email"
          name="email"
          type="text"
          required
          placeholder="Enter your email..."
          className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
        />
        <div className="w-full mt-2">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        "flex h-8 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-primary bg-primary text-white hover:bg-white hover:text-primary dark:hover:bg-transparent"
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Sign in with Email</p>}
    </button>
  );
}
