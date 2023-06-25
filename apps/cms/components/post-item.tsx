import Link from "next/link";
import { Content } from "@prisma/client";

import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PostOperations } from "@/components/post-operations";

interface PostItemProps {
  post: Content;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            Created: {formatDate(post.createdAt?.toDateString())} - Type:{" "}
            {post.type.title} - Status: {post.status.name}
          </p>
        </div>
      </div>
      <PostOperations post={{ id: post.id, title: post.title }} />
    </div>
  );
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
