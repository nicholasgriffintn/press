import { CardSkeleton } from "@/components/card-skeleton";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your website settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
