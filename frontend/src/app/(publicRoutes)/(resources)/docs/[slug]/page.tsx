import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXFileContent } from "@/lib/getMDXFileContent";
import getAllMDXContent from "@/lib/getAllMDXContent";

export async function generateStaticParams() {
  const mdx = await getAllMDXContent("docs");
  return mdx.map(({ slug }) => slug);
}

export default async function Legal({ params }: { params: { slug: string } }) {
  const { content } = await getMDXFileContent({ params, baseDir: "docs" });

  return (
    <article className="prose dark:prose-invert">
      <MDXRemote source={content} />
    </article>
  );
}
