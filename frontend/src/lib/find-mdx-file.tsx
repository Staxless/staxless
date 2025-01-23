/**
 * @file MDX File Finder Utility
 * @module findMDXFile
 * @description A utility function to find an MDX file with a specific slug in a directory within the app directory.
 */

import path from "path";
import { glob } from "glob";

/**
 * Finds an MDX file with a specific slug in a directory within the app directory.
 *
 * This function searches for the MDX file in the specified directory, excluding directories named "components".
 *
 * @param {string} slug - The slug of the MDX file to find (e.g., "my-article").
 * @param {string} dirName - The name of the directory to search within (e.g., "posts").
 * @returns {Promise<string | null>} A promise that resolves to the path of the found MDX file or null if not found.
 */
async function findMDXFile(
  slug: string,
  dirName: string,
): Promise<string | null> {
  const rootDir = process.cwd();
  const appDirPattern = path.join(rootDir, "**/app");

  try {
    const appDirs = await glob(appDirPattern);

    if (appDirs.length === 0) {
      console.error("App directory not found");
      return null;
    }

    if (appDirs.length > 1) {
      console.warn("Multiple app directories found. Using the first one.");
    }

    const appDir = appDirs[0];
    const dirGlobPattern = path.join(appDir, "**", dirName);
    const dirs = await glob(dirGlobPattern);

    if (dirs.length === 0) {
      console.error(`Directory "${dirName}" not found in app directory`);
      return null;
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
      return null;
    }

    const mdxGlobPattern = path.join(
      selectedDir,
      "**",
      "!(components)",
      `${slug}.mdx`,
    );

    const files = await glob(mdxGlobPattern, { nodir: true });

    if (files.length === 0) {
      console.warn(`No MDX file found for slug: ${slug}`);
      return null;
    }

    if (files.length > 1) {
      console.warn(
        `Multiple MDX files found for slug: ${slug}. Using the first one.`,
      );
    }

    return files[0];
  } catch (error) {
    console.error(`Error searching for MDX file: ${error}`);
    return null;
  }
}

export default findMDXFile;
