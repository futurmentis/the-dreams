// Values come from design/tokens.json. Keep both in sync.
export const Colors = {
  background: '#12141F',
  surface: '#1C1F2E',
  surfaceRaised: '#262A3C',
  line: '#2E3145',
  text: '#ECE6D8',
  textMuted: '#A9A595',
  accent: '#E2BD7A',
  onAccent: '#1B1608',
  danger: '#EE9C8A',
  onDanger: '#2A0F08',
  scrim: 'rgba(11, 12, 19, 0.82)',
} as const;

export const Fonts = {
  reading: 'Literata_400Regular',
  readingMedium: 'Literata_500Medium',
  ui: 'DMSans_400Regular',
  uiMedium: 'DMSans_500Medium',
  uiStrong: 'DMSans_600SemiBold',
} as const;

export const Type = {
  hero: { fontFamily: Fonts.readingMedium, fontSize: 34, lineHeight: 40 },
  display: { fontFamily: Fonts.readingMedium, fontSize: 30, lineHeight: 36 },
  number: { fontFamily: Fonts.readingMedium, fontSize: 52, lineHeight: 56 },
  statement: { fontFamily: Fonts.readingMedium, fontSize: 22, lineHeight: 30 },
  dreamTitle: { fontFamily: Fonts.readingMedium, fontSize: 20, lineHeight: 26 },
  dreamBody: { fontFamily: Fonts.reading, fontSize: 18, lineHeight: 30 },
  excerpt: { fontFamily: Fonts.reading, fontSize: 15, lineHeight: 23 },
  ui: { fontFamily: Fonts.ui, fontSize: 15, lineHeight: 22 },
  uiStrong: { fontFamily: Fonts.uiStrong, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: Fonts.ui, fontSize: 13, lineHeight: 18 },
  tab: { fontFamily: Fonts.ui, fontSize: 12, lineHeight: 16 },
  tabActive: { fontFamily: Fonts.uiStrong, fontSize: 12, lineHeight: 16 },
  eyebrow: { fontFamily: Fonts.uiMedium, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
} as const;

export const Space = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const Radius = { small: 8, medium: 12, large: 16, pill: 999 } as const;
export const Size = { touchMin: 48, button: 52, tabBar: 72, gutter: 20 } as const;
