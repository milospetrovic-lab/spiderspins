import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';
import SpiderWebCursor from '@/components/SpiderWebCursor';
import CustomCursor from '@/components/CustomCursor';
import FogLayers from '@/components/FogLayers';
import WebBackground from '@/components/WebBackground';
import GrainOverlay from '@/components/GrainOverlay';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import Preloader from '@/components/Preloader';
import AmbientParticles from '@/components/AmbientParticles';
import ParticleField3D from '@/components/ParticleField3D';
import HUDOverlay from '@/components/HUDOverlay';
import ScrollSpider from '@/components/ScrollSpider';
import ConfettiCannon from '@/components/ConfettiCannon';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SpiderSpins — Your web. Your rules.',
  description:
    'Every thread leads somewhere. Every spin tightens the web. SpiderSpins — patient, precise, always in control.',
  metadataBase: new URL('https://spiderspins.com'),
  openGraph: {
    title: 'SpiderSpins — Your web. Your rules.',
    description:
      'Transparent math, 500+ games, 8K+ Colony. The patient casino for players who read the web.',
    url: 'https://spiderspins.com',
    siteName: 'SpiderSpins',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpiderSpins — Your web. Your rules.',
    description:
      'Transparent math. Patient wins. 500+ games, 8K+ Colony.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body className="bg-void text-silk font-display antialiased">
        <Preloader />
        <ScrollProgress />
        <WebBackground />
        <AmbientParticles />
        <ParticleField3D />
        <FogLayers />
        <SpiderWebCursor />
        <GrainOverlay />
        <HUDOverlay />
        <ScrollSpider />
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <ConfettiCannon scope="viewport" />
      </body>
    </html>
  );
}
