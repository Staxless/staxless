/**
 * @file MDX Content Retrieval Utility
 * @module getAllMDXContent
 * @description A utility function to retrieve all MDX file paths and their slugs from a specified directory within the app directory.
 */

import path from "path";
import { glob } from "glob";

/**
 * @interface MDXFile
 * @description Represents an MDX file with its file path and slug
 * @property {string} filePath - The full path to the MDX file
 * @property {string} slug - The slug derived from the file name
 */
interface MDXFile {
  filePath: string;
  slug: string;
}

/**
 * Retrieves all MDX file paths and their slugs from a specified directory within the app directory.
 *
 * This function searches for MDX files in the specified directory, excluding directories named "components".
 *
 * @param {string} dirName - The name of the directory to search within (e.g., "posts").
 * @returns {Promise<MDXFile[]>} A promise that resolves to an array of MDXFile objects, each containing the file path and slug.
 */
async function getAllMDXContent(dirName: string): Promise<MDXFile[]> {
  const rootDir = process.cwd();
  const appDirPattern = path.join(rootDir, "**/app");

  try {
    const appDirs = await glob(appDirPattern);

    if (appDirs.length === 0) {
      console.error("App directory not found");
      return [];
    }

    if (appDirs.length > 1) {
      console.warn("Multiple app directories found. Using the first one.");
    }

    const appDir = appDirs[0];
    const dirGlobPattern = path.join(appDir, "**", dirName);
    const dirs = await glob(dirGlobPattern);

    if (dirs.length === 0) {
      console.error(`Directory "${dirName}" not found in app directory`);
      return [];
    }

    let selectedDir: string | null = null;
    for (const dir of dirs) {
      if (!dir.includes(path.join("components", dirName))) {
        selectedDir = dir;
        break;
      }
    }

    if (!selectedDir) {
      console.error(
        `No suitable "${dirName}" directory found outside of components in app directory`,
      );
      return [];
    }

    const mdxGlobPattern = path.join(
      selectedDir,
      "**",
      "!(components)",
      "*.mdx",
    );

    const files = await glob(mdxGlobPattern, { nodir: true });

    const mdxFiles = files.map((filePath) => {
      const relativePath = path.relative(selectedDir!, filePath);
      const slug = path.basename(relativePath, ".mdx");
      return { filePath, slug };
    });

    return mdxFiles;
  } catch (error) {
    console.error(`Error searching for MDX files: ${error}`);
    return [];
  }
}

export default getAllMDXContent;
