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

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  useEffect(() => {
    // Check if the screen size is mobile
    const handleResize = () => setIsMobile(window.innerWidth <= 599); // Adjust breakpoint as needed
    handleResize(); // Initial check on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      if (isMobile) {
        mainContent.style.marginLeft = "0px"; // Set to 0px for mobile
        mainContent.style.marginTop = "64px"; // Adjust for fixed navbar
        mainContent.style.padding = "0px"; // Adjust padding based on drawer state
      } else {
        mainContent.style.marginLeft = drawerOpen ? "240px" : "64px"; // Adjust based on drawer state for larger screens
        mainContent.style.marginTop = "64px"; // Adjust for fixed navbar
        mainContent.style.padding = "16px"; // Adjust padding based on drawer state
      }
    }
  }, [drawerOpen, isMobile]);

  useEffect(() => {
    document.title = "Liga Veteranos do Sado"; // Set the document title
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <Nav onDrawerToggle={handleDrawerToggle} />
        <div
          className="main-content"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
