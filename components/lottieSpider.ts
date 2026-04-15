// Hand-authored compact Lottie JSON — spider web draw-in + pulsing red eye.
// Kept small so we don't depend on a remote asset during dev. Consumed by
// lottie-web via animationData.

export const lottieSpiderData = {
  v: '5.7.6',
  fr: 30,
  ip: 0,
  op: 90,
  w: 240,
  h: 240,
  nm: 'SpiderWeb',
  ddd: 0,
  assets: [],
  layers: [
    // Outer ring — scales up + opacity fade in
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'outer-ring',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 20, s: [70] },
            { t: 60, s: [70] },
            { t: 90, s: [20] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 90, s: [45] },
          ],
        },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [20, 20, 100] },
            { t: 35, s: [100, 100, 100] },
            { t: 90, s: [108, 108, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [180, 180] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.73, 0.11, 0.11, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 1.2 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    // Inner ring
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'inner-ring',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 28, s: [55] },
            { t: 70, s: [55] },
            { t: 90, s: [10] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 90, s: [-60] },
          ],
        },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [10, 10, 100] },
            { t: 40, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.56, 0.09, 0.09, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 0.9 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    // Spokes — drawn in via trim path
    ...buildSpokes(),
    // Center red eye — scale pulse
    {
      ddd: 0,
      ind: 20,
      ty: 4,
      nm: 'eye',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 30, s: [100] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 30, s: [60, 60, 100] },
            { t: 50, s: [140, 140, 100] },
            { t: 70, s: [80, 80, 100] },
            { t: 90, s: [120, 120, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [12, 12] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.94, 0.27, 0.27, 1] },
              o: { a: 0, k: 100 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

function buildSpokes() {
  const layers: any[] = [];
  const spokes = 8;
  const radius = 90;
  for (let i = 0; i < spokes; i++) {
    const angle = (i / spokes) * Math.PI * 2 - Math.PI / 2;
    const x2 = Math.cos(angle) * radius;
    const y2 = Math.sin(angle) * radius;
    layers.push({
      ddd: 0,
      ind: 3 + i,
      ty: 4,
      nm: 'spoke' + i,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 8 + i * 2, s: [55] },
            { t: 70, s: [55] },
            { t: 90, s: [10] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [0, 0],
                    [x2, y2],
                  ],
                  c: false,
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.56, 0.09, 0.09, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 0.8 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [
                  { t: i * 2, s: [0] },
                  { t: 20 + i * 2, s: [100] },
                ],
              },
              o: { a: 0, k: 0 },
              m: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    });
  }
  return layers;
}
