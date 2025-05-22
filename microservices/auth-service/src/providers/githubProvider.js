import { GitHub } from "arctic";

export const GitHubProvider = () => ({
  instance: new GitHub(
    process.env.GITHUB_CLIENT_ID ?? "",
    process.env.GITHUB_CLIENT_SECRET ?? ""
  ),
  userInfoUrl: "https://api.github.com/user",
  name: "github",
  scopes: ["user:email"],
});

export default GitHubProvider;