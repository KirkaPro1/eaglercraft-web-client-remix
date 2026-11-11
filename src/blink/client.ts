import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'eaglercraf-web-client-e2nzn4j1',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_H6t6U6310cv-OpK3oy5CLh9bHaUN4uix',
  authRequired: false,
  auth: { mode: 'managed' },
})
