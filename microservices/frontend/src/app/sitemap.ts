import { BRAND_CONFIG } from '@config/brand-config';

export default function sitemap() {
  return [
    {
      url: BRAND_CONFIG.company.website,
      lastModified: new Date(),
    },
    {
      url: `${BRAND_CONFIG.company.website}/about`,
      lastModified: new Date(),
    },
    {
      url: `${BRAND_CONFIG.company.website}/blog`,
      lastModified: new Date(),
    },
    // Add more URLs as needed
  ];
}
