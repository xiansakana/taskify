import Image from "next/image";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-5 relative rounded-md overflow-hidden",
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
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "rounded-md bg-blue-600 text-sm font-semibold uppercase text-white",
          fallbackClassName
        )}>
        {name && name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
