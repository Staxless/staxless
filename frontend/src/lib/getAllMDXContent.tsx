import path from "path";
import { glob } from "glob";

interface MDXFile {
  filePath: string;
  slug: string;
}

/**
 * Retrieves all MDX file paths and their slugs from a specified directory within the app directory.
 *
 * This function searches for MDX files in the specified directory, excluding directories named "components".
 *
 * @param dirName - The name of the directory to search within (e.g., "posts").
 * @returns A promise that resolves to an array of MDXFile objects, each containing the file path and slug.
 */
async function getAllMDXContent(dirName: string): Promise<MDXFile[]> {
  const rootDir = process.cwd();

  // Pattern to find the app directory
  const appDirPattern = path.join(rootDir, "**/app");
  try {
    // Find app directories
    const appDirs = await glob(appDirPattern);

    if (appDirs.length === 0) {
      console.error("App directory not found");
      return [];
    }

    if (appDirs.length > 1) {
      console.warn("Multiple app directories found. Using the first one.");
    }

    const appDir = appDirs[0];

    // Pattern to find the specified directory within the app directory
    const dirGlobPattern = path.join(appDir, "**", dirName);

    const dirs = await glob(dirGlobPattern);

    if (dirs.length === 0) {
      console.error(`Directory "${dirName}" not found in app directory`);
      return [];
    }

    // Select a suitable directory, excluding directories named "components"
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

    // Pattern to find all MDX files in the selected directory, excluding "components"
    const mdxGlobPattern = path.join(
      selectedDir,
      "**",
      "!(components)",
      "*.mdx",
    );

    // Find MDX files
    const files = await glob(mdxGlobPattern, { nodir: true });

    // Map MDX files to MDXFile objects with paths and slugs
    const mdxFiles = files.map((filePath) => {
      const relativePath = path.relative(selectedDir, filePath);
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
