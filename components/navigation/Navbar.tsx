import { getSession } from "@/lib/session";
import { PublicNavbar } from "./PublicNavbar";
import { UserNavbar } from "./UserNavbar";

export async function Navbar() {
  const session = await getSession();

  if (session?.user) {
    return <UserNavbar initialUser={session.user} />;
  }

  return <PublicNavbar />;
}
