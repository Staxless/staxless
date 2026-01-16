// @ignore-ts-error ignoring type issues for slate-rich-text
// import { Element, Node } from 'slate'; // Import Slate types for rich text

// Define a base interface for all Payload CMS collection items
export interface BasePayloadItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  _status?: 'draft' | 'published';
  [key: string]: string | number | boolean | object | undefined;
}

// Define interfaces for related collections
export interface CategoryPayloadItem extends BasePayloadItem {
  name: string;
  slug: string;
  headline: string;
  description: string;
}

export interface MediaPayloadItem extends BasePayloadItem {
  url: string;
  alt?: string;
}

export interface UserPayloadItem extends BasePayloadItem {
  name?: string;
  email: string;
}

// Define a type for Slate content (rich text, code, MDX blocks)
export type SlateContent = Array<
  | Element
  | { _type?: string; slug?: string; [key: string]: string | number | boolean | object | undefined }
>;

export type PopulatedRelatedPostItem = Pick<
  BlogPostPayloadItem, 
  'id' | 'title' | 'slug' | 'category'
>;

export interface BlogPostPayloadItem extends BasePayloadItem {
  title: string;
  slug: string;
  description: Node[];
  content: SlateContent;
  publishedDate: string;
  category: string | CategoryPayloadItem;
  image: string | MediaPayloadItem;
  authors: Array<string | UserPayloadItem>;
  relatedPosts: Array<string | PopulatedRelatedPostItem>;
  metaDescription?: string;
  readTime?: number;
}

export interface PostSlugItem extends BasePayloadItem {
  slug: string;
  category: CategoryPayloadItem;
}

interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Fetches data from a specified Payload CMS collection.
 * @param collection The slug of the collection to fetch from (e.g., 'posts', 'users').
 * @param query Optional query parameters to filter, sort, or limit results.
 * @returns A promise that resolves to enforcement of items from the collection.
 */
export async function fetchFromPayload<T extends BasePayloadItem>(
  collection: string,
  query: Record<string, string> = {},
): Promise<T[]> {
  const isServer = typeof window === 'undefined';
  
  let url: URL;
  
  if (isServer) {
    // SERVER-SIDE: Go directly to Kong API Gateway via Docker network
    // This bypasses Next.js entirely - rewrites don't apply here
    const kongUrl = process.env.INTERNAL_API_URL || 'http://kong-api-gateway:8000';
    url = new URL(`${kongUrl}/cms/api/${collection}`);
  } else {
    // CLIENT-SIDE: Use relative URL which goes through Next.js server
    // The Next.js server will apply the rewrite to Kong
    url = new URL(`/cms/api/${collection}`, window.location.origin);
  }

  // Append query parameters
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  console.log(`[${isServer ? 'SERVER' : 'CLIENT'}] Fetching from: ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication if needed
        // 'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      },
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP Error ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: PayloadResponse<T> = await response.json();

    if (!data) {
      throw new Error(`Failed to fetch ${collection}: No data received`);
    }

    console.log(`✅ Successfully fetched ${data.docs.length} items from ${collection}`);
    
    return data.docs;
  } catch (error) {
    console.error(`❌ Error fetching from Payload CMS (${collection}):`, error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    return [];
  }
}

/**
 * Fetches all slugs for a given collection, typically used for generateGeneratedParams.
 * @param collection The slug of the collection (e.g., 'posts').
 * @returns A promise that resolves to an array of objects containing slugs and category slugs.
 */
export async function getAllSlugs(collection: string): Promise<Array<{ slug: string; categorySlug: string }>> {
  try {
    const items = await fetchFromPayload<PostSlugItem>(collection, {
      limit: '1000',
      where: JSON.stringify({
        _status: { equals: 'published' },
      }),
      depth: '1',
    });
    console.log(`Fetched ${items.length} slugs from ${collection}`);
    return items.map((item) => ({
      slug: item.slug,
      categorySlug: (item.category as CategoryPayloadItem).slug,
    }));
  } catch (error) {
    console.error(`Error fetching slugs for ${collection}:`, error);
    return [];
  }
}

/**
 * Fetches a single item by its slug from a specified collection.
 * @param collection The slug of the collection (e.g., 'posts').
 * @param slug The slug of the item to fetch.
 * @returns A promise that resolves to the item or null if not found.
 */
export async function getItemBySlug<T extends BasePayloadItem>(collection: string, slug: string): Promise<T | null> {
  try {
    const items = await fetchFromPayload<T>(collection, {
      where: JSON.stringify({
        slug: { equals: slug },
        _status: { equals: 'published' },
      }),
      limit: '1',
      depth: '2',
    });
    console.log(items);
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error(`Error fetching item by slug (${collection}/${slug}):`, error);
    return null;
  }
}

/**
 * Fetches published posts with pagination and optional category filtering.
 * @param page The page number to fetch.
 * @param limit The number of items per page.
 * @param category Optional category ID to filter posts by.
 * @returns A promise that resolves to an array of blog post items.
 */
export async function getPublishedPosts(page = 1, limit = 10, category?: string): Promise<BlogPostPayloadItem[]> {
  const whereConditions: Record<string, { equals: string } | { exists: true }> = {
    publishedDate: { exists: true },
    _status: { equals: 'published' },
  };

  if (category) {
    whereConditions.category = { equals: category };
  }

  return fetchFromPayload<BlogPostPayloadItem>('posts', {
    where: JSON.stringify(whereConditions),
    sort: '-publishedDate',
    page: page.toString(),
    limit: limit.toString(),
    depth: '1',
  });
}

/**
 * Fetches posts by a specific category.
 * @param category The category ID to filter posts by.
 * @returns A promise that resolves to an array of blog post items.
 */
export async function getPostsByCategory(category: string): Promise<BlogPostPayloadItem[]> {
  return fetchFromPayload<BlogPostPayloadItem>('posts', {
    where: JSON.stringify({
      category: { equals: category },
      _status: { equals: 'published' },
    }),
    sort: '-publishedDate',
    limit: '100',
    depth: '1',
  });
}

/**
 * Fetches all available categories with their respective post counts.
 * @returns A promise that resolves to an array of objects, each containing a category and its count.
 */
export async function getCategoriesWithCounts(): Promise<Array<{ category: CategoryPayloadItem; count: number }>> {
  try {
    const posts = await fetchFromPayload<BlogPostPayloadItem>('posts', {
      where: JSON.stringify({
        _status: { equals: 'published' },
      }),
      limit: '1000',
      depth: '1',
    });

    const categoryCounts = posts.reduce(
      (acc, post) => {
        const category = post.category as CategoryPayloadItem;
        acc[category.id] = (acc[category.id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const categories = await fetchFromPayload<CategoryPayloadItem>('categories', {
      limit: '1000',
    });

    return categories
      .filter((category) => categoryCounts[category.id])
      .map((category) => ({
        category,
        count: categoryCounts[category.id],
      }));
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    return [];
  }
}