import { BRAND_CONFIG } from "@/lib/brand-config"

const myFunction = () => {
  const url = `${BRAND_CONFIG.company.website}` 
   
  fetch(`${BRAND_CONFIG.company.website}/api/data`)
    .then((response) => response.json())
    .then((data) => {
      // Process the data
       
    })
    .catch((error) => {
      console.error("Error fetching data:", error)
    })
}

myFunction()

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
  ]
}