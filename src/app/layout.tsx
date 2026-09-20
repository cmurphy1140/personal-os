import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connor Murphy — Personal OS",
  description:
    "Systems work, project evidence, learning, and resume materials from Connor Murphy.",
};

const themeScript = `try{const t=localStorage.getItem("personal-os-theme");if(t)document.documentElement.dataset.theme=t}catch{}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
