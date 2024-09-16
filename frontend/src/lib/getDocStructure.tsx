import fs from "fs/promises";
import path from "path";

export interface DocItem {
  name: string;
  slug: string;
  fullPath: string;
  subItems?: DocItem[];
}

/**
 * Recursively retrieves the structure of documents in a specified directory.
 *
 * This function reads the contents of the given directory, and if it finds subdirectories,
 * it will recursively explore them. It constructs a hierarchical representation of the documents
 * and their subdirectories.
 *
 * @param dir - The directory to start scanning from.
 * @returns A promise that resolves to an array of `DocItem` objects representing the directory structure.
 */
export async function getDocStructure(dir: string): Promise<DocItem[]> {
  const baseDir = process.cwd();
  const fullDir = path.join(baseDir, dir);
  const entries = await fs.readdir(fullDir, { withFileTypes: true });
  const structure: DocItem[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(
      path.join(baseDir, "src/app/docs/content"),
      fullPath,
    );

    if (entry.isDirectory()) {
      // Recursively get the structure of subdirectories
      const subItems = await getDocStructure(fullPath);
      structure.push({
        name: entry.name,
        slug: entry.name.toLowerCase().replace(/\s+/g, "-"), // Convert directory name to slug format
        fullPath: relativePath,
        subItems,
      });
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      // Process MDX files
      const name = entry.name.replace(".mdx", "");
      structure.push({
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, "-"), // Convert file name to slug format
        fullPath: relativePath,
      });
    }
  }

  return structure;
}

/**
 * Constructs the full path to a document based on its `DocItem` properties.
 *
 * @param item - The `DocItem` object representing a document.
 * @returns The full path to the document.
 */
export function getDocPath(item: DocItem): string {
  return path.join(process.cwd(), "src/app/docs/content", item.fullPath);
}
