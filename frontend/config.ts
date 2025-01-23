export const siteConfig = {
    name: "Staxless",
    url: "https://staxless.com",
    description: "Your all-in-one SaaS solution",
    author: "Zachary Benson",
    title: "Staxless",
    social: {
      twitter: "@staxless",
    },
  }
  
  // Separate metadata object for more specific SEO and OpenGraph details
  export const siteMetadata = {
    title: siteConfig.title,
    author: siteConfig.author,
    description: siteConfig.description,
    siteUrl: siteConfig.url,
    siteName: siteConfig.name,
    social: {
      twitter: siteConfig.social.twitter,
    },
  }
  
  