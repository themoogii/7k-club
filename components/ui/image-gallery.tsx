"use client";

import React from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const galleryImages = [
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1494368308039-ed3393a402a4?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1080&q=90",
  "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1080&q=90",
];

export function ImageGallery() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="grid gap-6">
            {galleryImages.slice(col * 5, col * 5 + 5).map((src, index) => {
              const isPortrait = (col + index) % 2 === 0;
              const ratio = isPortrait ? 9 / 16 : 16 / 9;

              return (
                <AnimatedImage
                  key={`${col}-${index}`}
                  alt={`7K race archive ${col}-${index}`}
                  src={src}
                  ratio={ratio}
                  placeholder={`https://placehold.co/${isPortrait ? "1080x1920" : "1920x1080"}/111111/00ff00?text=7K`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedImageProps {
  alt: string;
  src: string;
  className?: string;
  placeholder?: string;
  ratio: number;
}

function AnimatedImage({ alt, src, ratio, placeholder, className }: AnimatedImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [isLoading, setIsLoading] = React.useState(true);
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleError = () => {
    if (placeholder) {
      setImgSrc(placeholder);
    }
  };

  return (
    <AspectRatio
      ref={ref}
      ratio={ratio}
      className={cn("bg-accent relative size-full overflow-hidden rounded-lg border", className)}
    >
      <img
        alt={alt}
        src={imgSrc}
        className={cn(
          "size-full rounded-lg object-cover opacity-0 transition-all duration-1000 ease-in-out",
          {
            "opacity-100": isInView && !isLoading,
          },
        )}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        onError={handleError}
      />
    </AspectRatio>
  );
}
