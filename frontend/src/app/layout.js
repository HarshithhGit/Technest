import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import ClientLayout from '../components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'TechNest Projects | Turning Ideas into Successful Projects',
  description: 'Premium educational technology solutions, technical academic projects for Engineering, Degree & Diploma students, IEEE works, and certifications.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
