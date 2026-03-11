import { Redirect } from "expo-router";

export default function Index() {
  // TODO: Add auth state check — redirect to /auth/landing if not logged in
  return <Redirect href="/(tabs)" />;
}
