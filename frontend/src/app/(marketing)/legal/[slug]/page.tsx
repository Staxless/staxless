import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import glob from "fast-glob"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"

const CONTENT_DIRECTORY = "content/legal"

export async function generateStaticParams() {
  const files = await glob(`${CONTENT_DIRECTORY}/*.mdx`, { cwd: process.cwd() })
  console.log("Found files:", files)

  return files.map((file) => ({
    slug: path.basename(file, ".mdx"),
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const content = await getContent(slug)

  if (!content) {
    return {}
  }

  return {
    title: `${content.frontmatter.title} | Minimal Docs Site`,
    description: content.frontmatter.description,
  }
}

async function getContent(slug: string) {
  try {
    console.log("Searching for slug:", slug)
    console.log("Current working directory:", process.cwd())
    const globPattern = `*/${CONTENT_DIRECTORY}/${slug}.mdx`
    console.log("Glob pattern:", globPattern)

    const files = await glob(globPattern, { cwd: process.cwd(), absolute: false })
    console.log("Matching files:", files)

    if (files.length === 0) {
      console.log("No matching files found")
      return null
    }

    // Find the file that contains the slug in its path
    const filePath = files.find((file) => file.toLowerCase().includes(slug.toLowerCase()))

    if (!filePath) {
      console.log(`No file found for slug: ${slug}`)
      return null
    }

    console.log("Reading file:", filePath)
    const fileContent = await fs.readFile(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)
    


    return {
      frontmatter,
      content,
    }
  } catch (error) {
    console.error(`Error reading file for slug ${slug}:`, error)
    return null
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  console.log("Rendering page for slug:", params.slug)
  const content = await getContent(params.slug)
  console.log("Content:", content ? content : "Not found")

  if (!content) {
    console.log("Content not found, redirecting to 404")
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={null} />
      <main className="flex-grow">
        <article className="prose dark:prose-invert max-w-3xl mx-auto py-8 px-4 mt-20">
          <MDXRemote source={content.content} />
        </article>
      </main>
      <Footer />
    </div>
  )
}

