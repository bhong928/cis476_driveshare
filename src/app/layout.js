import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NotificationBanner from "./components/NotificationBanner"; // Observer Pattern component
import Toast from "./components/Toast"; // Mediator Pattern component

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
        {/* Observer Pattern: NotificationBanner to display notifications from the notification service */}
        <NotificationBanner />
        {/* Mediator Pattern: Toast registers with the UI mediator and handles UI events */}
        <Toast />
        {children}
      </body>
    </html>
  );
}