// Fahrenheit One "Country Club" plum design tokens — shared with clubf1.com.au
// and dashboard.clubf1.tech. Plum bands for chrome, light tint for content.
export const UI = {
  bg:          '#F7F2F6', // page background (plum tint)
  surface:     '#FFFFFF', // cards
  surfaceAlt:  '#FBF7FA', // subtle alt surface (hover, disabled)
  text:        '#241626', // primary text (ink)
  textMuted:   '#6B5F6B', // secondary text
  textFaint:   '#9A8C99', // tertiary
  border:      '#E9E0E8', // hairline borders (rule)
  borderStrong:'#D8CBD7',

  // Deep plum chrome
  plum:        '#2A1830',
  plumDeep:    '#150A19',
  plumLine:    '#3A2240',
  onPlum:      '#E8DCE6', // primary text on plum
  onPlumMuted: '#C9B6C6', // secondary text on plum
  onPlumFaint: '#9C87A0', // labels on plum

  // Clay — the one CTA/accent colour
  clay:        '#C65A2E',
  clayHover:   '#AE4B23', // solid-button fill: clears 4.5:1 with white text
  clayDeep:    '#A0461F', // clay as small text on a light surface
  clayText:    '#D98A5E', // clay on plum

  shadow:      '0 1px 2px rgba(42,24,48,0.05), 0 6px 20px rgba(42,24,48,0.07)',
  shadowSm:    '0 1px 2px rgba(42,24,48,0.07)',
  radius:      16,
  radiusSm:    10,

  // Full-width dark band gradients, lifted from the marketing site
  glow:        'radial-gradient(90% 150% at 50% 26%, #523058 0%, #3A2240 34%, #2A1830 58%, #150A19 100%)',
  vignette:    'radial-gradient(120% 160% at 50% 30%, #3A2240 0%, #2A1830 45%, #150A19 100%)',
} as const
