import {useEffect, useRef, useState, type CSSProperties} from 'react';

/**
 * An image from public/ that may not exist yet. Until the file is added the
 * wrapper shows a dashed outline labelled with the path it expects, so the
 * layout stays intact and it is obvious which file to drop in.
 */
export function Asset({
  src,
  mobileSrc,
  alt = '',
  className = '',
  imgClassName = 'size-full object-contain',
  style,
  priority = false,
  width,
  height,
}: {
  src: string;
  mobileSrc?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // The error can fire before React attaches its handler.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div className={`relative ${missing ? 'asset-missing' : ''} ${className}`} style={style} data-asset={src.replace(/^\//, 'public/')}>
      <picture>
        {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          width={width}
          height={height}
          className={imgClassName}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setMissing(true)}
        />
      </picture>
    </div>
  );
}
