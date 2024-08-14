import "./globals.css";

export const metadata = {
  title: "Sales Portal",
  description: "Sales Portal App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
