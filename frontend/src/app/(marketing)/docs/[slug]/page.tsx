import { notFound } from "next/navigation"
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import glob from "fast-glob"

const DOCS_DIRECTORY = "content/docs"

export async function generateStaticParams() {
  const files = await glob(`${DOCS_DIRECTORY}/*.mdx`, { cwd: process.cwd() })
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
    const globPattern = `${DOCS_DIRECTORY}/${slug}.mdx`
    console.log("Glob pattern:", globPattern)

    const files = await glob("*/content/docs/*.mdx", { cwd: process.cwd(), absolute: false });
    console.log("Matching files:", files)

    if (files.length === 0) {
      console.log("No matching files found")
      return null
    }

    const filePath = files[0]
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
    <article className="prose dark:prose-invert max-w-3xl mx-auto">
      <h1>{content?.frontmatter.title}</h1>
      <MDXRemote source={content?.content} />
    </article>
  )
}

