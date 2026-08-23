import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
}

const DEFAULT_IMAGE = 'https://www.flaretechnologies.in/logo.webp';

export default function SEO({ title, description, canonical, ogUrl, ogTitle, ogDescription, image }: SEOProps) {
  const resolvedImage = image || DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={ogUrl || canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={resolvedImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={resolvedImage} />
    </Helmet>
  );
}
