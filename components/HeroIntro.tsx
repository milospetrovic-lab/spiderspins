'use client';

import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';

const KEY = 'spiderspins_intro_played';
const PRELOADER_KEY = 'spiderspins_loaded';

// useLayoutEffect on client, fall back to useEffect during SSR hydration
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function HeroIntro() {
  useIsoLayoutEffect(() => {
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {}
    const played = (() => {
      try {
        return !!sessionStorage.getItem(KEY);
      } catch {
        return false;
      }
    })();
    const reduced = !!(mq && mq.matches);

    if (played || reduced) {
      // Nothing to do — elements render at their natural, fully visible state
      return;
    }

    // Sync pre-hide (before paint) via inline styles — beats CSS naturally
    // because gsap writes inline styles and no !important rule is in play.
    gsap.set('[data-intro="warp"]', {
      autoAlpha: 0,
      scale: 2.4,
      filter: 'blur(6px)',
      transformOrigin: '50% 50%',
    });
    gsap.set('[data-intro="hex"]', {
      autoAlpha: 0,
      scale: 2.2,
      transformOrigin: '50% 50%',
    });
    gsap.set('[data-intro="grid"]', { autoAlpha: 0 });
    gsap.set('[data-intro="rain"]', { autoAlpha: 0 });
    gsap.set('[data-intro="text"] > *', { autoAlpha: 0, y: 18 });

    const preloadSeen = (() => {
      try {
        return !!sessionStorage.getItem(PRELOADER_KEY);
      } catch {
        return false;
      }
    })();
    const startDelay = preloadSeen ? 200 : 1100;

    const timer = window.setTimeout(() => {
      playIntro();
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {}
    }, startDelay);

    // Safety — if something goes catastrophically wrong after 6s, reveal.
    const safety = window.setTimeout(hardReveal, 6500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}

function playIntro() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onInterrupt: hardReveal,
    onComplete: () => {
      // Clear inline props so nothing stays pinned after the intro
      gsap.set(
        '[data-intro="warp"], [data-intro="hex"], [data-intro="grid"], [data-intro="rain"], [data-intro="text"] > *',
        { clearProps: 'transform,opacity,filter,visibility' }
      );
    },
  });

  // Warp rushes back from hyperspace
  tl.to('[data-intro="warp"]', {
    autoAlpha: 0.85, // will be normalized to element's stylistic opacity on clearProps
    scale: 1,
    filter: 'blur(1.2px)',
    duration: 1.6,
    ease: 'expo.out',
  });

  // Hex materializes (was zoomed in front, scales back to rest)
  tl.to(
    '[data-intro="hex"]',
    { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
    '-=1.25'
  );

  // Climax — centered spider burst just as the hex settles
  tl.add(() => {
    try {
      window.dispatchEvent(
        new CustomEvent('spiderspins:burst', {
          detail: {
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.52,
            dist: 2000,
          },
        })
      );
    } catch {}
  }, '-=0.55');

  // Text stagger-reveals after the burst
  tl.to(
    '[data-intro="text"] > *',
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    },
    '-=0.35'
  );

  // Grid + spider rain fade in
  tl.to(
    '[data-intro="grid"]',
    { autoAlpha: 1, duration: 0.9, ease: 'power2.out' },
    '-=0.55'
  );
  tl.to(
    '[data-intro="rain"]',
    { autoAlpha: 1, duration: 0.9, ease: 'power2.out' },
    '-=0.8'
  );
}

function hardReveal() {
  try {
    gsap.set(
      '[data-intro="warp"], [data-intro="hex"], [data-intro="grid"], [data-intro="rain"], [data-intro="text"] > *',
      { clearProps: 'transform,opacity,filter,visibility,y,scale' }
    );
  } catch {}
}
