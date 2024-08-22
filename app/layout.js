import "./globals.css";
import SessionProvider from "../components/client/SessionProvider";
import { getServerSession } from "next-auth/next";

export const metadata = {
  title: "Sales Portal",
  description: "Sales Portal App",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
