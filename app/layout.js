'use client'
import localFont from "next/font/local";
import "./globals.css";
import Nav from "./components/Nav";
import { useState, useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Liga dos Veteranos do Sado",
//   description: "Liga dos Veteranos do Sado",
// };

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (drawerOpen) {
      mainContent.style.marginLeft = "240px"; // Adjust based on the width of your opened drawer
    } else {
      mainContent.style.marginLeft = "64px"; // Adjust based on the width of your closed drawer
    }
  }, [drawerOpen]);

  useEffect(() => {
    document.title = "Liga Veteranos do Sado"; // Set the document title
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <Nav onDrawerToggle={handleDrawerToggle} />
        <div className="main-content" style={{ marginTop: "64px", padding: "16px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}