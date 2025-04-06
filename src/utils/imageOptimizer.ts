/**
 * Utility functions for image optimization
 */

// Convert image URL to WebP format if supported
export function getOptimizedImageUrl(url: string): string {
  // If already a WebP or SVG, return as is
  if (url.endsWith(".webp") || url.endsWith(".svg")) {
    return url;
  }

  // If it's an external URL (like Unsplash), return as is
  if (url.includes("unsplash.com") || url.includes("http")) {
    return url;
  }

  // For local images, check if we have a WebP version
  const basePath = url.substring(0, url.lastIndexOf("."));
  return `${basePath}.webp`;
}

// Generate srcset for responsive images
export function generateSrcSet(url: string, sizes: number[] = [300, 600, 900]): string {
  if (url.includes("http") || !url.includes(".")) {
    return url;
  }

  const basePath = url.substring(0, url.lastIndexOf("."));
  const extension = url.substring(url.lastIndexOf("."));

  return sizes.map((size) => `${basePath}-${size}w${extension} ${size}w`).join(", ");
}

// Calculate aspect ratio for image placeholders
export function calculateAspectRatio(width: number, height: number): number {
  return (height / width) * 100;
}

// Generate a lightweight placeholder color
export function generatePlaceholderColor(seed: string): string {
  // Simple hash function to generate a consistent color based on the image URL
  let hash = 0;
  for (let i = 0; i < seed?.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate a light pastel color
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`;
}
