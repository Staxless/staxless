import { cookies } from "next/headers";
import axios from "axios";

interface Session {
  fresh: boolean;
  expiresAt: Date;
}

interface User {
  username: string;
}

interface SessionInfo {
  data: {
    user: User;
    session: Session;
  };
}

export default async function getUser(): Promise<string | null> {
  const sessionCookie = cookies().get("auth_session") ?? null;
  if (!sessionCookie) return null;

  try {
    const sessionInfo = await axios.post<SessionInfo>(
      "http://auth-service:8000/auth/validate-request",
      {},
      {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`, // Pass the cookies as a string
        },
      },
    );

    const { user, session } = sessionInfo.data;
    if (session && session.fresh) {
      return user.username;
    }

    return null;
  } catch {
    return null;
  }
}
