import BenefitsSlider from '@/components/BenefitsSlider';
import GameCards from '@/components/GameCards';
import WebVault from '@/components/WebVault';
import VIPTiers from '@/components/VIPTiers';
import TermsCalculator from '@/components/TermsCalculator';
import StatsCounters from '@/components/StatsCounters';
import Colony from '@/components/Colony';
import Spinnerets from '@/components/Spinnerets';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import SpiderRain from '@/components/SpiderRain';
import InteractiveWebGrid from '@/components/InteractiveWebGrid';
import PaymentCard from '@/components/PaymentCard';
import HeroHexFrame from '@/components/HeroHexFrame';
import WarpTunnel from '@/components/WarpTunnel';
import HeroScrollTransition from '@/components/HeroScrollTransition';
import HeroBottomDrip from '@/components/HeroBottomDrip';

export default function HomePage() {
  return (
    <>
      <HeroScrollTransition />

      {/* HERO — v2 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Layer 1 — barely-there warp tunnel backdrop (animated in on intro) */}
        <div
          data-intro="warp"
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ opacity: 0.32, filter: 'blur(1.2px)' }}
        >
          <WarpTunnel minimal speed={0.35} />
        </div>

        {/* Layer 2 — dim hex frame (zooms through camera on intro) */}
        <div
          data-intro="hex"
          aria-hidden
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ transformOrigin: '50% 50%' }}
        >
          <HeroHexFrame />
        </div>

        {/* Layer 3 — v1 interactive dot grid (fades in after climax) */}
        <div
          data-intro="grid"
          aria-hidden
          className="absolute inset-0 z-[4]"
        >
          <InteractiveWebGrid />
        </div>

        {/* Layer 4 — spider rain (fades in after climax) */}
        <div
          data-intro="rain"
          aria-hidden
          className="absolute inset-0 z-[5] pointer-events-none"
        >
          <SpiderRain />
        </div>

        {/* Layer 5 — very soft center darken so text stays legible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background:
              'radial-gradient(ellipse 44% 38% at 50% 52%, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0) 70%)',
          }}
        />

        <div
          data-intro="text"
          className="relative z-[7] max-w-5xl mx-auto text-center pointer-events-none"
        >
          <p className="font-mono text-silk-dim text-xs uppercase tracking-[0.4em] mb-8">
            V2 · Warp · Drag · Confetti
          </p>
          <h1 className="font-display font-black text-silk leading-[0.95] text-[clamp(3rem,10vw,7rem)]">
            Your web.
            <br />
            Your{' '}
            <span className="text-strike relative">
              rules
              <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-strike" />
            </span>
            .
          </h1>
          <p className="mt-8 max-w-2xl mx-auto font-display font-light text-silk-dim text-lg md:text-xl">
            Patient math. Red silk. A casino for players who read the web.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#enter"
              className="hover-target hero-skip-intro inline-flex items-center px-8 py-4 bg-venom text-silk uppercase tracking-[0.15em] text-sm font-display font-medium hover:bg-strike transition-colors shadow-strike-glow"
            >
              Enter the Web
            </a>
            <a
              href="#benefits"
              className="hover-target hero-skip-intro inline-flex items-center px-8 py-4 border border-web-light/60 text-silk-dim hover:text-silk uppercase tracking-[0.15em] text-sm font-display font-medium transition-colors"
            >
              Learn the math
            </a>
          </div>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-shadow">
            Drag anywhere on the page to pull silk — release for confetti
          </p>
        </div>

        {/* Dripping silk nets at the bottom (asymmetric, organic) */}
        <HeroBottomDrip />
      </section>

      <BenefitsSlider />
      <GameCards />
      <StatsCounters />
      <WebVault />
      <VIPTiers />
      <TermsCalculator />
      <PaymentCard />
      <Spinnerets />
      <Colony />
      <FinalCTA />
      <Footer />
    </>
  );
}
