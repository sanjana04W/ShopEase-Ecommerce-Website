import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeInjector from '@/components/ThemeInjector';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopEase | Premium E-Commerce Store',
  description: 'Your premium, one-stop shop for high-quality curated products.',
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'system';
    var resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={geist.className}>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
        >
          <ThemeInjector />
          <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar />
            <main className='min-h-screen'>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
