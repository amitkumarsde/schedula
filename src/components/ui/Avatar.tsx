"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function Avatar({
  imageUrl,
  fullName,
  size = 96,
}: {
  imageUrl: string;
  fullName: string;
  size?: number;
}) {
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const iconSize = Math.round(size * 0.42);

  if (!imageUrl || hasImageFailed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-2xl bg-surface"
      >
        <User style={{ width: iconSize, height: iconSize }} className="text-muted" />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={fullName}
      width={size}
      height={size}
      onError={() => setHasImageFailed(true)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-2xl bg-surface object-cover"
    />
  );
}
