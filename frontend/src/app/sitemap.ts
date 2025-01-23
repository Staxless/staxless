import { siteConfig } from "../../config"
import { siteMetadata } from "../../config"

const myFunction = () => {
  const url = `${siteConfig.url}` 
  console.log(`Accessing: ${url}`)
  fetch(`${siteConfig.url}/api/data`)
    .then((response) => response.json())
    .then((data) => {
      // Process the data
      console.log(data)
    })
    .catch((error) => {
      console.error("Error fetching data:", error)
    })
}

myFunction()

export default function sitemap() {
  return [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteMetadata.siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteMetadata.siteUrl}/blog`,
      lastModified: new Date(),
    },
    // Add more URLs as needed
  ]
}

