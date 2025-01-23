import type { Metadata } from "next"
import { siteMetadata } from "../../config"

export type MetadataProps = {
  title?: string
  description?: string
  params: { slug: string }
}

export function generateCustomMetadata({ title, description, params }: MetadataProps): Metadata {
  // Use params to create dynamic title or description if needed
  const dynamicTitle = params?.slug
    ? `${params.slug} | ${siteMetadata.title}`
    : title
      ? `${title} | ${siteMetadata.title}`
      : siteMetadata.title

  const dynamicDescription = params?.slug ? `Page about ${params.slug}` : description || siteMetadata.description

  return {
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: dynamicDescription,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteMetadata.siteUrl,
      title: dynamicTitle,
      description: dynamicDescription,
      siteName: siteMetadata.title, // Assuming siteName is the same as title
    },
    twitter: {
      card: "summary_large_image",
      site: siteMetadata.social.twitter,
    },
    // You can add more metadata properties here if needed
  }
}

