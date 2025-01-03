/**
 * @file app/actions/getUser.ts
 * @description Route handler for retrieving authenticated user data
 */

// TODO: Move to actions
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/auth";

/**
 * Handler for retrieving authenticated user data
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user, {
    status: 200,
    headers: {
      "Cache-Control": "private, max-age=60",
    },
  });
}
