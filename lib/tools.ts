// The Club F1 tool registry — powers both the public landing tiles and the
// Team Access grid columns. Add a tool here and it appears in both places.
export type Tool = {
  key: string        // matches the per-tool grant key in app_metadata.apps
  name: string
  description: string
  url: string        // subdomain it lives on
  live: boolean      // false → shown as "coming soon" on the landing
}

export const TOOLS: Tool[] = [
  {
    // One grant for all three Studio sections in Consolidation — Images,
    // Movies and Marketing share the `studio` key.
    key: 'studio',
    name: 'Studio',
    description: 'The image, movie and marketing libraries — brief new assets in the house style, and build co-branded pieces from what is already shot.',
    url: 'https://app.clubf1.tech',
    live: true,
  },
  {
    key: 'dashboard',
    name: 'Pre-Opening Dashboard',
    description: 'Live sales & market-intelligence for the Fahrenheit One pre-opening pipeline — leads, conversions, membership demand and opening-day readiness.',
    url: 'https://dashboard.clubf1.tech',
    live: true,
  },
  {
    key: 'mc',
    name: 'Mission Control',
    description: 'The GM command centre — capture insights by domain, triage them, dispatch to the team via ClickUp, and generate AI strategic briefs.',
    url: 'https://mc.clubf1.tech',
    live: true,
  },
  {
    key: 'engagement',
    name: 'Engagement Monitor',
    description: 'Member at-risk scoring from engagement tags, with AI-drafted retention comms a trainer approves before they go out.',
    url: 'https://engagement.clubf1.tech',
    live: true,
  },
  {
    key: 'accountability',
    name: 'Accountability',
    description: 'Daily KPI scorecard and ops checklist, rolled up weekly for managers and monthly for the board — goals set by Fahrenheit One HQ.',
    url: 'https://accountability.clubf1.tech',
    live: true,
  },
]
