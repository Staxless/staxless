import { ReactNode } from "react";
import { DocNavigation } from "@/components/docs/DocNavigation";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { getDocStructure } from "@/lib/getDocStructure";
import { getMDXFileContent } from "@/lib/getMDXFileContent";
import { Metadata } from "next";

interface DocItem {
  name: string;
  path: string;
  subItems?: DocItem[];
}

interface GenerateMetadataProps {
  params: { slug: string };
}

interface MDXData {
  title?: string;
  description?: string;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { data } = await getMDXFileContent({ params, baseDir: "docs" });
  const mdxData = data as MDXData;

  return {
    title: mdxData.title || "Documentation",
    description: mdxData.description || "No description available",
  };
}

interface DocsLayoutProps {
  children: ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const docStructure = await getDocStructure(
    "src/app/(publicRoutes)/(resources)/docs/content",
  );

  return (
    <div className="flex flex-1 min-h-screen">
      <aside className="w-64 border-r border-gray-200 overflow-y-auto">
        <DocNavigation docStructure={docStructure} />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <article>{children}</article>
        </div>
      </main>
      <TableOfContents />
    </div>
  );
}
