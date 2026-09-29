import { useEffect } from 'react'
import { recordCardView } from './twi'
import { VIEW_THRESHOLD_MS } from './cards'

// Counts one open once a card has been on screen for VIEW_THRESHOLD_MS.
// Time only accumulates while the app is visible, so locking the phone or
// switching apps pauses the clock. Leaving the card before the threshold
// records nothing. Each new visit to the card can count again.
export function useCardView(card, enabled = true) {
  useEffect(() => {
    if (!enabled || !card) return
    let visibleMs = 0
    let startedAt = document.visibilityState === 'visible' ? Date.now() : null
    let timer = null
    let done = false

    function schedule() {
      clearTimeout(timer)
      if (done || startedAt === null) return
      timer = setTimeout(fire, Math.max(0, VIEW_THRESHOLD_MS - visibleMs))
    }

    function fire() {
      if (done) return
      done = true
      recordCardView(card).catch((err) => console.error('Failed to record card open', err))
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        startedAt = Date.now()
      } else if (startedAt !== null) {
        visibleMs += Date.now() - startedAt
        startedAt = null
      }
      schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      done = true
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [card, enabled])
}
