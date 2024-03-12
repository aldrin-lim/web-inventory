import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'
import { v4 } from 'uuid'
const sessionId = v4()
const useSessionTracking = () => {
  useEffect(() => {
    // Function to track session start
    const trackSessionStart = () => {
      mixpanel.track('Session Start', {
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }

    // Function to track session end
    const trackSessionEnd = () => {
      mixpanel.track('Session End', {
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }

    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        mixpanel.track('Session End', {
          sessionId,
          timestamp: new Date().toISOString(),
        })
      } else {
        mixpanel.track('Session Resumed', {
          sessionId,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Track session start
    trackSessionStart()

    // Add visibility change event listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Cleanup: remove event listener and track session end
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackSessionEnd()
    }
  }, [])
}

export default useSessionTracking
