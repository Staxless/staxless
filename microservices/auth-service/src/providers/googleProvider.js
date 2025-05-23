
export const GoogleProvider = () => ({
  instance: new Google(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    process.env.GOOGLE_REDIRECT_URI ?? ""
  ),
  userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
  name: "google",
  scopes: ["profile", "email"],
});

export default GoogleProvider;