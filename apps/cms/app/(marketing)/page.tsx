import { Icons } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-black">
      <div className="m-auto w-48 dark:text-white">
        <Icons.logo className="mx-auto h-6 w-6" />
      </div>
    </div>
  );
}
