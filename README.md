# SpiderSpins — v2

**Tagline:** Your web. Your rules. (experimental variant)

Experimental branch of SpiderSpins with additional WOW features on top of v1.

## What's different vs v1

- **Warp tunnel** — contained Three.js tube with wine-red streaks, octagonal spider-web mask
- **Scroll-scrubbed hero transition** — as you scroll out of the hero, warp rushes forward, hex shatters through the camera, spider-confetti burst fires at ~85% scroll
- **ParticleField3D** — CSS/GSAP perspective starfield on top of AmbientParticles (dual-layer)
- **Interactive drag-to-draw cannon** — spider anchor + multi-strand silk thread + spider-glyph particle burst (desktop), restricted to FinalCTA on touch
- **Cashier upgrades** — card form with auto-detected Visa/Mastercard, disintegrate-to-particles, crypto rails with auto-renew, generic deposit popup, celebration "Paid" flash with centered spider burst
- **Auth** — sign in/sign up modal (sessionStorage demo), signed-in-only deposit history
- **Preloader** — Lottie spider-web intro alongside SVG silk draw
- **Hero bottom drips** — asymmetric silk threads hanging into next section
- **VIP tiers** — 3D tilt + scale on hover (lerped)
- **Detect-GPU** — adaptive particle counts (low tier → 35% density)

## Stack extras over v1

- `lottie-web` — preloader animation
- `detect-gpu` — tiered particle budgets
- `@tsparticles/confetti` — installed but currently unused (cannon uses the custom canvas renderer)

## Run locally

```bash
npm install
npm run dev   # http://localhost:3200
```

## Credits

Designed & built by **Milos Petrovic** — Marketing Assistant.
