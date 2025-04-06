import { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  objectFit = "cover",
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  // Handle image loading errors
  const handleError = () => {
    // If the image fails to load, use a placeholder
    if (src !== "/placeholder.jpg") {
      setImageSrc("/placeholder.jpg");
    }
  };

  // Reset image source if prop changes
  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      style={{ objectFit }}
      onError={handleError}
      decoding="async"
    />
  );
}
