import { hotjar } from 'react-hotjar'
import * as Sentry from '@sentry/react'
import mixpanel, { Dict } from 'mixpanel-browser'

const {
  VITE_MIXPANEL_ID,
  VITE_HOTJAR_ID,
  VITE_SENTRY_DSN,
  VITE_SENTRY_ENVIRONMENT,
  MODE,
} = import.meta.env

export const Analytics = {
  init: () => {
    if (MODE === 'production') {
      console.log('analytics initialized')
      VITE_SENTRY_ENVIRONMENT &&
        VITE_SENTRY_DSN &&
        Sentry.init({
          dsn: VITE_SENTRY_DSN,
          environment: MODE,
          integrations: [Sentry.browserTracingIntegration()],
          tracesSampleRate: 1.0,
        })
      VITE_MIXPANEL_ID &&
        mixpanel.init(VITE_MIXPANEL_ID, {
          debug: MODE !== 'production',
          track_pageview: true,
          persistence: 'localStorage',
          ignore_dnt: true,
          api_transport: 'sendBeacon',
        })
      VITE_HOTJAR_ID && hotjar.initialize(parseInt(VITE_HOTJAR_ID), 6)
    }
  },
  identify: (id: string) => {
    if (MODE === 'production') {
      console.log('user identified')
      VITE_MIXPANEL_ID && mixpanel.identify(id)
      VITE_HOTJAR_ID && hotjar.identify(id, {})
      VITE_SENTRY_DSN && Sentry.setUser({ id })
    }
  },
  alias: (id: string) => {
    VITE_MIXPANEL_ID && mixpanel.alias(id)
  },
  track: (name: string, props?: Dict) => {
    if (MODE === 'production' && VITE_MIXPANEL_ID) {
      VITE_MIXPANEL_ID && mixpanel.track(name, props)
      VITE_HOTJAR_ID && hotjar.event(name)
    }
  },
  trackUnhandledError: (error: unknown) => {
    if (MODE === 'production' && VITE_SENTRY_ENVIRONMENT && VITE_SENTRY_DSN) {
      Sentry.captureException(error)
    }
  },
  trackPageView: (name: string, props?: Dict) => {
    if (MODE === 'production' && VITE_MIXPANEL_ID) {
      mixpanel.track_pageview({ name, ...props })
    }
  },
  people: {
    set: (props: Dict) => {
      VITE_MIXPANEL_ID && mixpanel.people.set(props)
    },
  },
}
