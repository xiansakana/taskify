import Image from "next/image";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-10 relative rounded-md overflow-hidden",
          className
        )}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="rounded-md bg-blue-600 text-lg font-semibold uppercase text-white">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
