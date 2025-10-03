"use client";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "../components/Nav";
import { ThemeWrapper } from "../components/ThemeWrapper";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  useEffect(() => {
    // Check if the screen size is mobile
    const handleResize = () => setIsMobile(window.innerWidth <= 599);
    handleResize(); // Initial check on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      if (isMobile) {
        mainContent.style.marginLeft = "0px";
        mainContent.style.marginTop = "64px";
        mainContent.style.padding = "0px";
      } else {
        mainContent.style.marginLeft = drawerOpen ? "240px" : "64px";
        mainContent.style.marginTop = "64px";
        mainContent.style.padding = "16px";
      }
    }
  }, [drawerOpen, isMobile]);

  useEffect(() => {
    document.title = "Liga Veteranos do Sado";
  }, []);

  // Check if current route is admin login
  const isAdminLogin = pathname === "/admin/login";

  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <ThemeWrapper>
          {!isAdminLogin && <Nav onDrawerToggle={handleDrawerToggle} />}
          <div className={isAdminLogin ? "" : "main-content"}>{children}</div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
