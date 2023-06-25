"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

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
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface SiteSettingsFormProps extends React.HTMLAttributes<HTMLFormElement> {
  site: Pick<User, "id" | "name">;
}

async function deleteSite(siteId: string) {
  const response = await fetch(`/api/sites/${siteId}`, {
    method: "DELETE",
  });

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your post was not deleted. Please try again.",
      variant: "destructive",
    });
  }

  return true;
}

export function SiteSettingsForm({ site, className }: SiteSettingsFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Destructive Actions</CardTitle>
          <CardDescription>
            These are actions that cannot be undone once completed, so please
            make sure that you really want to do them before completing the
            action!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <button
              onClick={() => setShowDeleteAlert(true)}
              className={cn(
                buttonVariants({ variant: "destructive" }),
                className
              )}
              disabled={isSaving}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Delete This Site</span>
            </button>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the site {site.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone!
            </AlertDialogDescription>
            <>
              <Label htmlFor="site-name">Enter the site name to confirm</Label>
              <Input
                id="site-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={name !== site.name}
              onClick={async (event) => {
                event.preventDefault();
                setIsSaving(true);

                const deleted = await deleteSite(site.id);

                if (deleted) {
                  setIsSaving(false);
                  setShowDeleteAlert(false);
                  router.refresh();
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isSaving ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
