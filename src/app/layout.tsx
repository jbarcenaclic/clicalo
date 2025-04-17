import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CLÍCALO – Plataforma de Recompensas",
  description: "Gana dinero real con tiradas diarias desde tu celular.",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            const vapidKey = '${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}';
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/service-worker.js').then(async reg => {
                console.log('✅ Service Worker listo');

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                  const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: vapidKey
                  });

                  // Guardar en tu backend
                  await fetch('/api/save-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                  });
                }
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
