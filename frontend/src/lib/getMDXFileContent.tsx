/**
 * @file MDX File Content Retrieval Utility
 * @module getMDXFileContent
 * @description A utility function to retrieve the content and metadata of an MDX file based on its slug.
 */

import fs from "fs/promises";
import matter from "gray-matter";
import findMDXFile from "./findMDXFile";

/**
 * @interface MDXFileContent
 * @description Represents the content and metadata of an MDX file
 * @property {string} content - The main content of the MDX file
 * @property {Record<string, unknown>} data - The frontmatter metadata of the MDX file
 */
interface MDXFileContent {
  content: string;
  data: Record<string, unknown>;
}

/**
 * Retrieves the content and metadata of an MDX file based on its slug.
 *
 * This function locates the MDX file using the provided slug and base directory,
 * then reads and parses the file to extract its content and frontmatter metadata.
 *
 * @param {Object} params - An object containing the parameters for file retrieval
 * @param {string} params.params.slug - The slug of the MDX file to retrieve
 * @param {string} params.baseDir - The base directory where MDX files are located
 * @returns {Promise<MDXFileContent>} A promise that resolves to an object containing the content and metadata of the MDX file
 */
export async function getMDXFileContent({
  params,
  baseDir,
}: {
  params: { slug: string };
  baseDir: string;
}): Promise<MDXFileContent> {
  // Find the path of the MDX file based on the slug and base directory
  const filePath = await findMDXFile(params.slug, baseDir);

  if (!filePath) {
    console.error(`MDX file not found for slug: ${params.slug}`);
    return { content: "", data: {} }; // Return empty content and data if file is not found
  }

  try {
    // Read and parse the MDX file content
    const fileContent = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(fileContent);
    return { content, data };
  } catch (error) {
    console.error(`Error reading MDX file: ${error}`);
    return { content: "", data: {} }; // Return empty content and data if an error occurs
  }
}

export default getMDXFileContent;
