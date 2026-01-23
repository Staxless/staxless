import { NextResponse } from 'next/server';
import { getUser } from '@/lib/validate-user';

// Disable static caching for this dynamic auth route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await getUser();

    if (result.success) {
      const response = NextResponse.json({ user: result.data });
      // Allow browser caching for 10 seconds to reduce rapid successive calls
      // private ensures it's not cached by CDNs/proxies
      response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=20');
      return response;
    }

    // Don't cache unauthorized responses
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    const response = NextResponse.json({ user: null }, { status: 500 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }
}
