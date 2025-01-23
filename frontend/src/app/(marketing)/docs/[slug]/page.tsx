import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXFileContent } from "@/lib/get-mdx-file-content";
import getAllMDXContent from "@/lib/get-all-mdx-content";
import { generateCustomMetadata, MetadataProps } from '../../../../lib/generate-metadata'
import type { Metadata } from "next";

export async function generateStaticParams() {
  const mdx = await getAllMDXContent("docs");
  return mdx.map(({ slug }) => slug);
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {

  // Use our custom function to generate the metadata
  return generateCustomMetadata({
    title: `${params.slug} | Documentation`, // This will be used in the template
    description: `${params.slug} | Documentation`,
    params,
  })
}


export default async function Legal({ params }: { params: { slug: string } }) {
  const { content } = await getMDXFileContent({ params, baseDir: "docs" });

  return (
    <article className="prose dark:prose-invert">
      <MDXRemote source={content} />
    </article>
  );
}
