import { BRAND_CONFIG } from '@/lib/brand-config';

const myFunction = () => {
  const _url = `${BRAND_CONFIG.company.website}`;

  fetch(`${BRAND_CONFIG.company.website}/api/data`)
    .then((response) => response.json())
    .then((_data) => {
      // Process the data
    })
    .catch(() => {
      // Ignore fetch errors for sitemap data
    });
};

myFunction();

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
