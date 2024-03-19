import { useEffect } from 'react'
import { v4 } from 'uuid'
import { Analytics } from 'util/analytics'
const sessionId = v4()
const useSessionTracking = () => {
  useEffect(() => {
    // Function to track session start
    const trackSessionStart = () => {
      Analytics.track('Session Start', {
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }

    // Function to track session end
    const trackSessionEnd = () => {
      Analytics.track('Session End', {
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }

    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        Analytics.track('Session End', {
          sessionId,
          timestamp: new Date().toISOString(),
        })
      } else {
        Analytics.track('Session Resumed', {
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
