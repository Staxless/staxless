import type { Metadata } from 'next';
import { BRAND_CONFIG } from './brand-config';

export type MetadataProps = {
  title?: string;
  description?: string;
  params: { slug: string };
};

export function generateCustomMetadata({
  title,
  description,
  params,
}: MetadataProps): Metadata {
  // Use params to create dynamic title or description if needed
  let dynamicTitle: string;
  if (params?.slug) {
    dynamicTitle = `${params.slug} | ${BRAND_CONFIG.seo.title}`;
  } else if (title) {
    dynamicTitle = `${title} | ${BRAND_CONFIG.seo.title}`;
  } else {
    dynamicTitle = BRAND_CONFIG.seo.title;
  }

  const dynamicDescription = params?.slug
    ? `Page about ${params.slug}`
    : description || BRAND_CONFIG.seo.description;

  return {
    title: {
      default: BRAND_CONFIG.seo.title,
      template: `%s | ${BRAND_CONFIG.seo.title}`,
    },
    description: dynamicDescription,
    authors: [{ name: BRAND_CONFIG.company.name }], // Using company name as author
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: BRAND_CONFIG.company.website,
      title: dynamicTitle,
      description: dynamicDescription,
      siteName: BRAND_CONFIG.seo.title,
    },
    twitter: {
      card: 'summary_large_image',
      site: BRAND_CONFIG.social.twitter,
    },
    keywords: BRAND_CONFIG.seo.keywords,
    metadataBase: new URL(BRAND_CONFIG.company.website),
    // Add ogImage if available in BRAND_CONFIG
    ...(BRAND_CONFIG.seo.ogImage && {
      openGraph: {
        images: [
          {
            url: BRAND_CONFIG.seo.ogImage,
            width: 1200,
            height: 630,
            alt: `${BRAND_CONFIG.seo.title} Open Graph Image`,
          },
        ],
      },
    }),
  };
}
