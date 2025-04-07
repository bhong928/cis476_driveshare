import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NotificationBanner from "./components/NotificationBanner"; // Adjust path if necessary

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Drive Share",
  description: "CIS 476 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotificationBanner />
        {children}
      </body>
    </html>
  );
}