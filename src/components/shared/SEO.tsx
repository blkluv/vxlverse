import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
}

export function SEO({
  title = "VXLVerse - Create 3D Games & Art Galleries",
  description = "Build incredible 3D games and stunning virtual art galleries with VXLVerse. No coding required. Start your creative journey today.",
  keywords = "3D games, art gallery, virtual gallery, game creation, 3D modeling, no-code, game engine",
  ogImage = "/og-image.jpg",
  ogUrl = "https://vxlverse.com",
  ogType = "website",
  twitterCard = "summary_large_image",
}: SEOProps) {
  const fullTitle = title.includes("VXLVerse") ? title : `${title} | VXLVerse`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
}
