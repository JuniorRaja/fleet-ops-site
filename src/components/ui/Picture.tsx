import { cn } from "@/utils/cn";

interface PictureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional next-gen sources: drop real files in and pass them here. */
  avif?: string;
  webp?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/** AVIF/WebP-ready <picture>, lazy by default, with intrinsic size to prevent layout shift. */
export function Picture({
  src,
  alt,
  width,
  height,
  avif,
  webp,
  sizes,
  priority,
  className,
  imgClassName,
}: PictureProps) {
  return (
    <picture className={className}>
      {avif && <source srcSet={avif} type="image/avif" sizes={sizes} />}
      {webp && <source srcSet={webp} type="image/webp" sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={(e) => {
          e.currentTarget.style.opacity = "0";
        }}
      />
    </picture>
  );
}
