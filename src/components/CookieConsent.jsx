import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONSENT_OPEN_EVENT, loadAnalytics, readConsent, setConsent } from '../lib/analytics'
import '../style/cookie-consent.css'

const CookieConsent = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const consent = readConsent()
    if (consent === 'granted') loadAnalytics()
    // Storage is only readable in the browser, so the first-visit check runs after mount.
    else if (!consent) setOpen(true)

    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (granted) => {
    setConsent(granted)
    setOpen(false)
  }

  return (
    <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-text">
      <p id="cookie-consent-title" className="cookie-consent__title">Cookies</p>
      <p id="cookie-consent-text" className="cookie-consent__text">
        We'd like to use Google Analytics cookies to understand how visitors use our website. They are
        only set if you accept. See our <Link to="/policy">Privacy Policy</Link>.
      </p>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__btn" onClick={() => choose(false)}>Decline</button>
        <button type="button" className="cookie-consent__btn cookie-consent__btn--accept" onClick={() => choose(true)}>Accept</button>
      </div>
    </div>
  )
}

export default CookieConsent
