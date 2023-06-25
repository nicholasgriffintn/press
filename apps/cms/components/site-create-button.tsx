"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface SiteCreateButtonProps extends ButtonProps {}

export function SiteCreateButton({
  className,
  variant,
  ...props
}: SiteCreateButtonProps) {
  const router = useRouter();
  const [showCreateSiteAlert, setShowCreateSiteAlert] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        url,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          title: "Limit of 1 site reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        });
      }

      return toast({
        title: "Something went wrong.",
        description: "Your post was not created. Please try again.",
        variant: "destructive",
      });
    }

    const site = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/sites/${site.id}`);
  }

  return (
    <>
      <button
        onClick={() => setShowCreateSiteAlert(true)}
        className={cn(
          buttonVariants({ variant }),
          {
            "cursor-not-allowed opacity-60": isLoading,
          },
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.add className="mr-2 h-4 w-4" />
        )}
        New site
      </button>
      <AlertDialog
        open={showCreateSiteAlert}
        onOpenChange={setShowCreateSiteAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create a new site</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the form below to create your new site:
            </AlertDialogDescription>
            <>
              <Label htmlFor="site-name">Name</Label>
              <Input
                id="site-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </>
            <>
              <Label htmlFor="site-url">URL</Label>
              <Input
                id="site-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="text"
              />
            </>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClick}
              className={cn(
                buttonVariants({ variant }),
                {
                  "cursor-not-allowed opacity-60": isLoading,
                },
                className
              )}
              disabled={isLoading || !name || !url}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.add className="mr-2 h-4 w-4" />
              )}
              <span>Create New Site</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
