import { notFound } from "next/navigation";

import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getAllMDXContent from "@/lib/get-all-mdx-content";
import getMDXFileContent from "@/lib/get-mdx-file-content";

export default async function DocsPage() {
  try {
    // Get all MDX files in the docs directory
    const allDocs = await getAllMDXContent("docs");

    // Sort the docs by their slug to ensure consistent ordering
    const sortedDocs = allDocs.sort((a, b) => a.slug.localeCompare(b.slug));

    // Get the first doc
    const firstDoc = sortedDocs[0];

    if (!firstDoc) {
      notFound();
    }

    // Get the content of the first doc
    const { content, data } = await getMDXFileContent({
      params: { slug: firstDoc.slug },
      baseDir: "docs",
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="prose prose-blue max-w-none">
          <MDXRemote source={content} />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Documentation</h2>
          <ul className="space-y-2">
            {sortedDocs.map((doc) => (
              <li key={doc.slug}>
                <Link href={`/docs/${doc.slug}`}>
                  <Button variant="link" className="p-0 h-auto">
                    {doc.slug}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in DocsPage:", error);
    notFound();
  }
}
